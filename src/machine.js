import kebabToCamel from './kebabToCamel';
import capitalize from './capitalize';

const machines = {};

const proxyHandler = {
    get: (obj, prop) => {
        if (prop.indexOf('is') === 0) {
            const state = prop.replace('is', '').toLowerCase();

            return obj.isState.bind(obj, state);
        }

        return obj[prop];
    },
};

class Machine {
    constructor(configuration) {
        this.subscribers = [];
        this.transitions = configuration.transitions;
        this.state = configuration.state;
        this.handlers = configuration.handlers;

        Object.entries(this.handlers).forEach(([name, func]) => {
            this[name] = (...args) => func.call(this, args);
        });

        Object.entries(this.transitions).forEach(([state]) => {
            this[state] = (data) => this.input(state, data);
        });

        return new Proxy(this, proxyHandler);
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
        return state === this.state.current;
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

    setState(state, data) {
        this.state = {
            ...this.state,
            current: state,
            ...data,
        };

        this.emit();

        const handler = `on${capitalize(kebabToCamel(state))}`;

        if (handler in this) {
            this[handler](data);
        }
    }

    emit() {
        this.subscribers.forEach((cb) => cb.call(null, this.state));
    }
}

export function createMachine(name, configuration) {
    machines[name] = new Machine(configuration);
}

export function getMachine(name) {
    return machines[name];
}
