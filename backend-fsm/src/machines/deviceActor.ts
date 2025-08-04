import { createActor } from 'xstate';
import { deviceMachine } from './deviceMachine';

// Factory function to create device actors with specific machineIds
// - Returns a running, interactive instance of the machine
// - Each actor can receive events (via .send) and emits state updates (via .subscribe)
export const createDeviceActor = (machineId: string) => {
  return createActor(deviceMachine, {
    input: { machineId }
  });
};