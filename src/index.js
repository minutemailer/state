import { useEffect, useState } from 'react';

export function createMachine(
    transitions,
    actions,
    initialContext,
    initialState = 'IDLE',
) {
    const listeners = new Set();
    let state = initialState;
    let context = initialContext;

    const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    return {
        destroy() {
            listeners.clear();
            state = initialState;
            context = initialContext;
        },

        action(action, input) {
            const transition = transitions[state];
            const nextState = transition.on[action];

            if (!nextState) {
                console.warn('Invalid transition', state, action);
                return;
            }

            console.log(
                `Machine transition: ${state} -> ${nextState} (${action}, ${input})`,
            );

            const previousState = state;

            if (actions[action]) {
                context = actions[action].call(this, context, input) || context;
            }

            state = nextState;
            listeners.forEach((listener) =>
                listener(state, previousState, context),
            );
        },

        can(action) {
            const transition = transitions[state];
            return !!transition.on[action];
        },

        useCurrentState() {
            const [currentState, setCurrentState] = useState(state);

            useEffect(() => {
                return subscribe(() => setCurrentState(state));
            }, []);

            return currentState;
        },

        useCurrentContext(selector) {
            const [currentContext, setCurrentContext] = useState(() =>
                selector(context),
            );

            useEffect(() => {
                return subscribe(() => setCurrentContext(selector(context)));
            }, []);

            return currentContext;
        },
        getContext() {
            return context;
        },
    };
}
