import { createActor } from 'xstate';
import { deviceMachine } from './deviceMachine';

export function initSingleDevice() {
  const actor = createActor(deviceMachine);

  // Simple subscription 
  actor.subscribe((state) => {
    const { deviceId } = state.context;
    
    if (state.value === 'attempt1') {
      console.log(`🔄 [${deviceId}] Connecting... (attempt 1/3)`);
    } else if (state.value === 'attempt2') {
      console.log(`🔄 [${deviceId}] Connecting... (attempt 2/3)`);
    } else if (state.value === 'attempt3') {
      console.log(`🔄 [${deviceId}] Connecting... (attempt 3/3)`);
    }
  });

  actor.start();
  return actor;
}