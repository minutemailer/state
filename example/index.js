import { createMachine, getMachine } from '../index';

createMachine('kanye', {
    state: {
        current: 'idle',
        quote: null,
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
            setTimeout(() => {
                fetch('https://api.kanye.rest')
                    .then(response => response.json())
                    .then(({ quote }) => {
                        this.success({ quote });
                    })
                    .catch((error) => {
                        this.failure({ error });
                    });
            }, 2000);
        },
    }
});


const machine = getMachine('kanye');
const button = document.getElementById('fetch');
const retry = document.getElementById('retry');
const error = document.getElementById('error');
const blockquote = document.querySelector('blockquote');
const listener = (state) => {
    switch (state.current) {
        case 'idle':
            button.innerHTML = 'Fetch a quote from Kanye';
            blockquote.innerHTML = state.quote;
            break;
        case 'fetching':
            button.style.display = 'inline-block';
            retry.style.display = 'none';
            button.innerHTML = '...Fetching';
            error.innerHTML = '';
            blockquote.innerHTML = '';
            break;
        case 'error':
            button.innerHTML = 'Retry';
            button.style.display = 'none';
            retry.style.display = 'inline-block';
            error.innerHTML = state.error;
            break;
    }
};

machine.subscribe(listener);

button.addEventListener('click', machine.fetch);
retry.addEventListener('click', machine.retry);
