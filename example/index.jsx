import React from 'react';
import { render } from 'react-dom';
import { createMachine, useMachine } from '../index';

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
            }, 500);
        },
    }
});

const If = ({ condition, render }) => {
    if (!condition) {
        return null;
    }

    return render();
};

const App = () => {
    const [{ current, ...data }, machine] = useMachine('kanye');

    return (
        <>
            <If condition={current === 'idle'} render={() => (
                <>
                    <p><button type="button" className="button" onClick={machine.fetch}>Fetch a Kanye quote</button></p>
                    <blockquote><p>{data.quote}</p></blockquote>
                </>
            )} />
            <If condition={current === 'fetching'} render={() => (
                <p>Fetching...</p>
            )} />
            <If condition={current === 'error'} render={() => (
                <>
                    <p><button type="button" className="button button--error" onClick={machine.retry}>Retry</button></p>
                    <blockquote><p>{data.error.toString()}</p></blockquote>
                </>
            )} />
        </>
    );
};

render(<App />, document.getElementById('app'));
