import { createActor } from 'xstate';
import { deviceMachine } from './deviceMachine';
import { allDevices } from '../../../config/layout.config';

export function initDeviceActors() {
  const actors: Record<string, ReturnType<typeof createActor>> = {};

  for (const device of allDevices) {
    const actor = createActor(deviceMachine, {
      input: { machineId: device.id }
    });

    // Subscribe to state changes for comprehensive logging
    actor.subscribe((state) => {
      const { machineId, successfulAttempt } = state.context;
      
      switch (state.value) {
        case 'attempt1':
          console.log(`🔄 [${machineId}] Connecting... (attempt 1/3)`);
          break;
          
        case 'attempt2':
          console.log(`🔄 [${machineId}] Connecting... (attempt 2/3)`);
          break;
          
        case 'attempt3':
          console.log(`🔄 [${machineId}] Connecting... (attempt 3/3)`);
          break;
          
        case 'idle':
          console.log(`✅ [${machineId}] Connected successfully on attempt ${successfulAttempt}`);
          break;
          
        case 'running':
          console.log(`🏃 [${machineId}] Running`);
          break;
          
        case 'complete':
          console.log(`🏁 [${machineId}] Complete`);
          break;
          
        case 'error':
          console.log(`❌ [${machineId}] Failed after 3 attempts`);
          break;
      }
    });

    actor.start();
    actors[device.id] = actor;
  }

  return actors;
}