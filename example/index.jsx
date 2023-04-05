import { createRoot } from 'react-dom/client';
import quoteMachine from './machine';
import { useMachine } from '../src';

import '@minutemailer/facade/styles/theme.scss';
import '@minutemailer/facade/styles/foundation.css';
import Button from '@minutemailer/facade/components/Button';
import Body from '@minutemailer/facade/components/Typography/Body';
import Stack from '@minutemailer/facade/components/Stack';

const App = () => {
    const [{ quote }, machine] = useMachine(quoteMachine, null, [
        'quote',
        'current',
    ]);

    return (
        <div>
            <Button disabled={!machine.can('fetch')} onClick={machine.fetch}>
                {machine.isIdle() && 'What would Kanye say?'}
                {machine.isFetching() && "Let's see..."}
            </Button>
            {quote !== undefined && (
                <Stack align="center" valign="middle" padding marginTop>
                    <Body>{quote}</Body>
                </Stack>
            )}
        </div>
    );
};

const root = createRoot(document.getElementById('app'));

root.render(<App />);
