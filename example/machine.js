import {createMachine} from '../src';

export default createMachine('quote', {
    state: {
        current: 'idle',
        quote: undefined,
        error: false,
    },

    transitions: {
        fetch: { from: 'idle', to: 'fetching' },
        success: { from: 'fetching', to: 'idle' },
        failure: { from: 'fetching', to: 'error' },
        retry: { from: 'error', to: 'fetching' },
    },

    handlers: {
        onFetching() {
            fetch('https://api.kanye.rest')
                .then(response => response.json())
                .then(({ quote }) => {
                    this.success({ quote });
                })
                .catch((error) => {
                    this.failure({ error: error.message() });
                });
        },
    }
});
