import { createActor } from 'xstate';
import { deviceMachine } from './deviceMachine';

export function initSingleDevice() {
  const actor = createActor(deviceMachine);

  actor.subscribe((state) => {
    const { deviceId, retryCount, maxRetries } = state.context;
    
    if (state.value === 'connecting') {
      if (retryCount === 0) {
        console.log(`🔄 [${deviceId}] Connecting...`);
      } else {
        console.log(`🔄 [${deviceId}] Retry ${retryCount}/${maxRetries}`);
      }
    } else if (state.value === 'retrying') {
      console.log(`❌ [${deviceId}] Failed, retrying...`);
    }
  });

  actor.start();
  return actor;
}