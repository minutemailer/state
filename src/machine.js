import kebabToCamel from './kebabToCamel';
import capitalize from './capitalize';

const machines = {};

const proxyHandler = {
    get: (obj, prop) => {
        if (typeof prop === 'string' && prop.indexOf('is') === 0 && !(prop in obj)) {
            const state = prop.replace('is', '');

            return obj.isState.bind(obj, state.charAt(0).toLowerCase() + state.slice(1));
        }

        return obj[prop];
    },
};

export function getMachine(name, id = null) {
    let machine = machines[name];

    if (id) {
        const idName = `${name}.${id}`;

        machine = getMachine(idName);

        if (!machine) {
            machine = createMachine(name, null, id);
        }
    }

    return machine;
}

class Machine {
    constructor(name, configuration, id = null, initialData = {}, sync = false) {
        this.name = name;
        this.id = id;
        this.sync = sync;
        this.subscribers = [];
        this.configuration = configuration;
        this.transitions = this.configuration.transitions;
        this.state = { ...this.configuration.state, ...initialData };
        this.handlers = this.configuration.handlers;

        Object.entries(this.handlers).forEach(([name, func]) => {
            this[name] = (...args) => func.apply(this, args);
        });

        Object.entries(this.transitions).forEach(([state]) => {
            this[state] = (...data) => {
                this.input(state, data);
            };
        });

        return new Proxy(this, proxyHandler);
    }

    getMachine(machine) {
        return getMachine(machine);
    }

    setSync(sync) {
        this.sync = sync;
    }

    getParent() {
        const [parent] = this.name.split('.');

        if (parent !== this.name) {
            return parent;
        }

        return null;
    }

    getParentMachine() {
        const parent = this.getParent();

        if (parent) {
            return getMachine(parent);
        }

        return null;
    }

    getParentAttr() {
        const [parent] = this.name.split('.');

        if (parent !== this.name) {
            return parent;
        }

        return this.name;
    }

    getChildAttr() {
        const [parent, child] = this.name.split('.');

        if (parent !== this.name) {
            return child;
        }

        return this.name;
    }

    getChildMachines() {
        const parent = this.getParent();

        if (!parent) {
            const childMachines = Object.keys(machines)
                .filter((name) => name.indexOf(`${this.name}.`) > -1);

            return childMachines;
        }

        return [];
    }

    isParent() {
        const childMachines = this.getChildMachines();

        return childMachines.length > 0;
    }

    isChild() {
        return this.getParent() !== null;
    }

    subscribe(cb) {
        if (!this.subscribers.includes(cb)) {
            this.subscribers.push(cb);
        }

        return {
            unsubscribe: () => {
                this.subscribers = this.subscribers.filter((subscribedCb) => subscribedCb !== cb);
            },
        };
    }

    isState(state) {
        return state === this.state.current || state === kebabToCamel(this.state.current);
    }

    transitionAllowed(currentState, action) {
        const transition = this.transitions[action];

        return transition && transition.from === currentState;
    }

    input = (action, data) => {
        const { current } = this.state;

        if (!this.transitionAllowed(current, action)) {
            return;
        }

        const transition = this.transitions[action];

        this.setState(transition.to, data);
    };

    setData(data, silent = false) {
        this.setState(this.state.current, [data], silent);
    }

    setState(state, data = [], silent = false) {
        const newData = (data.length && typeof data[0] === 'object') ? data[0] : {};
        const prevState = `${this.state.current}`;
        const newState = { ...newData };

        if (state !== prevState) {
            newState.current = state;
        }

        this.state = {
            ...this.state,
            ...newState,
        };

        if (!silent) {
            this.emit(newState);

            if (prevState !== this.state.current) {
                const handler = `on${capitalize(kebabToCamel(state))}`;

                if (handler in this) {
                    this[handler](...data);
                }
            }
        }
    }

    emit(newData) {
        this.subscribers.forEach((cb) => cb.call(null, newData, this.state));

        if (this.sync) {
            const parentMachine = this.getParentMachine();

            if (parentMachine) {
                const childAttr = this.getChildAttr();
                const parentAttr = this.getParentAttr();
                const data = {...this.state[childAttr]};
                const transition = `update${capitalize(childAttr)}`;
                const items = [...parentMachine.state[parentAttr]];
                const index = items.findIndex((item) => item.id === data.id);

                if (index > -1) {
                    items[index] = {
                        ...items[index],
                        ...data,
                    };

                    parentMachine[transition]({[parentAttr]: items});
                }
            }
        }
    }

    destroy() {
        machines[this.name] = null;
        delete machines[this.name];
    }
}

export function createMachine(name, configuration = {}, id = null) {
    if (!(name in machines)) {
        machines[name] = new Machine(name, configuration, null);
    }

    if (id) {
        const idName = `${name}.${id}`;
        const [parent, child] = name.split('.');
        let sync = false;
        let data = null;

        if (idName in machines) {
            return machines[idName];
        }

        if (parent !== name) {
            const parentMachine = getMachine(parent);

            if (parentMachine && parent in parentMachine.state) {
                const items = parentMachine.state[parent];
                const item = items.find((item) => item.id === id);

                if (item) {
                    data = {[child]: item};

                    sync = true;

                    parentMachine.setSync(true);
                }
            }
        }

        machines[idName] = new Machine(
            idName,
            { ...machines[name].configuration },
            id,
            data,
            sync,
        );

        return machines[idName];
    }

    return machines[name];
}
