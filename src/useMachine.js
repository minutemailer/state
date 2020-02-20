import { useEffect, useState } from 'react';
import { getMachine } from './machine';

export default function useMachine(name) {
    const machine = getMachine(name);

    if (!machine) {
        throw new Error('Machine not found');
    }

    const [state, setState] = useState(machine.state);

    useEffect(() => {
        const subscription = machine.subscribe(setState);

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return [state, machine];
}
