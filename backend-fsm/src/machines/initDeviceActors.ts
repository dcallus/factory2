import { createActor } from 'xstate';
import { deviceMachine } from './deviceMachine';
import { allDevices } from '../../../config/layout.config';

export function initDeviceActors() {
  const actors: Record<string, ReturnType<typeof createActor>> = {};

  for (const device of allDevices) {
    const actor = createActor(deviceMachine, {
      input: { deviceId: device.id }
    });

    // Subscribe to state changes for each device
    actor.subscribe((state) => {
      const { deviceId, retryCount, maxRetries } = state.context;
      
      if (state.value === 'connecting') {
        if (retryCount === 0) {
          console.log(`🔄 [${deviceId}] Connecting...`);
        }
      } else if (state.value === 'retrying') {
        console.log(`🔄 [${deviceId}] Retry ${retryCount}/${maxRetries}`);
      } else if (state.value === 'processing') {
        console.log(`⚙️ [${deviceId}] Processing...`);
      } else if (state.value === 'complete') {
        console.log(`✅ [${deviceId}] Complete`);
      } else if (state.value === 'failed') {
        console.log(`❌ [${deviceId}] Device needs attention`);
      }
    });

    actor.start();
    actors[device.id] = actor;
  }

  console.log(`🚀 Started ${allDevices.length} device actors`);
  return actors;
}