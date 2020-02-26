import React, { useEffect, useCallback } from 'react';
import { render } from 'react-dom';
import { createMachine, useMachine } from '../src';
import '@minutemailer/ui/design-system/scss/style.scss';
import {Text, Typography, Alert, Box, Checkbox} from '@minutemailer/ui';

createMachine('todos', {
    state: {
        current: 'idle',
        todos: [],
        error: false,
    },

    transitions: {
        fetch: { from: 'idle', to: 'fetching' },
        success: { from: 'fetching', to: 'idle' },
        failure: { from: 'fetching', to: 'error' },
        retry: { from: 'error', to: 'fetching' },
        updateTodo: { from: 'idle', to: 'idle' },
    },

    handlers: {
        onFetching() {
            fetch('https://jsonplaceholder.typicode.com/todos')
                .then(response => response.json())
                .then((todos) => {
                    this.success({ todos });
                })
                .catch((error) => {
                    this.failure({ error: error.message() });
                });
        },

        onUpdatingTodo({ todo }) {
            //console.log(todo);
        }
    }
});

createMachine('todos.todo', {
    state: {
        current: 'idle',
        todo: {},
        error: false,
    },

    transitions: {
        update: { from: 'idle', to: 'updating' },
        updated: { from: 'updating', to: 'idle' },
        sync: { from: 'idle', to: 'idle' },
    },

    handlers: {
        onUpdating({ completed }) {
            this.updated({
                todo: {
                    ...this.state.todo,
                    completed,
                },
            });
        },
    }
});

const If = ({ condition, render }) => {
    if (!condition) {
        return null;
    }

    return render();
};

const Todo = ({ id }) => {
    const [{ todo }, machine] = useMachine('todos.todo', id);
    const update = useCallback((completed) => machine.update({ completed }), []);

    return (
        <Box marginBottom="xs">
            <Alert type={(todo.completed) ? null : 'warning'}>
                <Checkbox checked={todo.completed} onChange={update}>{todo.title}</Checkbox>
            </Alert>
        </Box>
    );
};

const Todos = () => {
    const [{ todos, error }, machine] = useMachine('todos');
    const completedTodos = todos.filter(todo => todo.completed).length;
    const allTodos = todos.length;

    useEffect(machine.fetch, []);

    return (
        <>
            <Typography variant="secondary-headline" marginBottom="s">Todo list ({`${completedTodos}/${allTodos}`})</Typography>
            <If condition={machine.isFetching()} render={() => {
                return <Text>Fetching</Text>;
            }} />
            <If condition={!machine.isFetching()} render={() => {
                return todos.map((todo) => <Todo id={todo.id} key={todo.id} />);
            }} />
            <If condition={machine.isError()} render={() => (
                <Alert action="Retry" type="error" onClick={machine.retry}>
                    {error.toString()}
                </Alert>
            )} />
        </>
    );
};

const StateTracker = () => {
    const [{ current }] = useMachine('todos');

    return <Box marginTop="s"><Alert type="warning">Current state: {current}</Alert></Box>
};

const App = () => (
    <Box background padding rounded>
        <Todos />
        <StateTracker />
    </Box>
);

render(<App />, document.getElementById('app'));
