import { createActor } from 'xstate';
import { deviceMachine } from './deviceMachine';

export function initSingleDevice() {
  const actor = createActor(deviceMachine);

  actor.subscribe((state) => {
    const { deviceId, retryCount, maxRetries } = state.context;
    
    if (state.value === 'connecting') {
      console.log(`🔄 [${deviceId}] Connecting... (attempt ${retryCount + 1}/${maxRetries})`);
    } else if (state.value === 'retrying') {
      console.log(`❌ [${deviceId}] Attempt ${retryCount} failed, retrying...`);
    }
  });

  actor.start();
  return actor; 
}