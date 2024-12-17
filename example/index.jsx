import { createRoot } from 'react-dom/client';
import quoteMachine from './machine';

const App = () => {
    const state = quoteMachine.useCurrentState();
    const quote = quoteMachine.useCurrentContext((context) => context.quote);

    return (
        <div>
            <button
                disabled={!quoteMachine.can('fetch')}
                onClick={() => quoteMachine.action('fetch')}
            >
                {state === 'IDLE' && 'What would Kanye say?'}
                {state === 'FETCHING' && "Let's see..."}
            </button>
            {quote !== undefined && (
                <div style={{ padding: '40px' }}>
                    <p>{quote}</p>
                </div>
            )}
        </div>
    );
};

const root = createRoot(document.getElementById('root'));

root.render(<App />);
