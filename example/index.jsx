import { render } from 'react-dom';
import quoteMachine from './machine';
import {useMachine} from '../src';

const App = () => {
    const [{ quote, current }, machine] = useMachine(quoteMachine, null, ['quote', 'current']);

    return (
        <div>
            <button disabled={!machine.can('fetch')} onClick={machine.fetch}>
                {machine.isIdle() && 'What would Kanye say?'}
                {machine.isFetching() && 'Let\'s see...'}
            </button>
            {quote !== undefined && (
                <blockquote>
                    <p>{quote}</p>
                </blockquote>
            )}
        </div>
    );
};

render(<App />, document.getElementById('app'));
