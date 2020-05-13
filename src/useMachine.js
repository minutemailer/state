import { useEffect, useState, useMemo } from 'react';
import { getMachine } from './machine';
import filterObject from './filterObject';

export default function useMachine(name, id = null, reducer = false, persistent = true) {
    const machine = useMemo(() => getMachine(name, id), [name, id]);

    if (!machine) {
        throw new Error('Machine not found');
    }

    if (reducer === false) {
        return machine;
    }

    const [state, setState] = useState(filterObject(machine.state, reducer));

    useEffect(() => {
        const subscription = machine.subscribe((newState) => {
            const newData = filterObject(newState, reducer);

            if (Object.keys(newData).length) {
                setState((oldState) => ({...oldState, ...newData }));
            }
        });

        return () => {
            subscription.unsubscribe();

            if (!persistent) {
                machine.destroy();
            }
        };
    }, []);

    return [state, machine];
}
