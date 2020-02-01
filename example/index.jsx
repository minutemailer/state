import React from 'react';
import { render } from 'react-dom';
import { createMachine, useMachine } from '../index';
import '@minutemailer/ui/design-system/scss/style.scss';

import { Button, Typography, Alert, Box } from '@minutemailer/ui';

createMachine('kanye', {
    state: {
        current: 'idle',
        quote: null,
        error: false,
    },

    transitions: {
        fetch: { from: 'idle', to: 'fetch-ing' }, // fetch-ing to test kebab to camel
        success: { from: 'fetch-ing', to: 'idle' },
        failure: { from: 'fetch-ing', to: 'error' },
        retry: { from: 'error', to: 'fetch-ing' },
    },

    handlers: {
        onFetchIng() {
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

const Quote = () => {
    const [{ current, quote, error }, machine] = useMachine('kanye');

    return (
        <>
            <Typography variant="secondary-headline" marginBottom="s">Kanye Rest</Typography>
            <If condition={current === 'idle' || current === 'fetch-ing'} render={() => (
                <Alert action={(current === 'fetch-ing') ? 'Fetching...' : 'Fetch'} onClick={machine.fetch}>
                    {(current === 'fetch-ing') ? '...' : quote || 'No quote'}
                </Alert>
            )} />
            <If condition={current === 'error'} render={() => (
                <Alert action="Retry" type="error" onClick={machine.retry}>
                    {error.toString()}
                </Alert>
            )} />
        </>
    );
};

const StateTracker = () => {
    const [{ current }] = useMachine('kanye');

    return <Box marginTop="s"><Alert type="warning">Current state: {current}</Alert></Box>
};

const App = () => (
    <Box background padding rounded>
        <Quote />
        <StateTracker />
    </Box>
);

render(<App />, document.getElementById('app'));
