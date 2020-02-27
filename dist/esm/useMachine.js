import { useEffect, useState } from 'react';
import { getMachine } from './machine';
export default function useMachine(name, id = null, initialData = null) {
  const machine = getMachine(name, id, initialData);

  if (!machine) {
    throw new Error('Machine not found');
  }

  const [state, setState] = useState(machine.state);
  useEffect(() => {
    const [parent] = name.split('.');
    const subscription = machine.subscribe(setState);
    return () => {
      subscription.unsubscribe();

      if (id) {
        machine.destroy();
      }
    };
  }, []);
  return [state, machine];
}