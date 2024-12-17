import { createMachine } from '../src';

const transitions = {
    IDLE: {
        on: {
            fetch: 'FETCHING',
        },
    },
    FETCHING: {
        on: {
            success: 'IDLE',
            failure: 'ERROR',
        },
    },
    ERROR: {
        on: {
            fetch: 'FETCHING',
        },
    },
};

const actions = {
    fetch(context) {
        fetch('https://api.kanye.rest')
            .then((response) => response.json())
            .then(({ quote }) => this.action('success', { quote }))
            .catch((error) => this.action('failure', { error }));

        return {
            ...context,
            quote: undefined,
        };
    },
    success(context, { quote }) {
        return {
            ...context,
            quote,
        };
    },
    failure(context, { error }) {
        return {
            ...context,
            error: error.message,
        };
    },
};

const initialContext = {
    quote: undefined,
    error: null,
};

export default createMachine(transitions, actions, initialContext);
