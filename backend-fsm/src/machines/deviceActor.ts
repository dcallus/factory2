import { createActor } from 'xstate';
import { deviceMachine } from './deviceMachine';

// Creates the actor instance from the device state machine:
// - An actor is a running, interactive instance of the machine
// - It can receive events (via .send) and emits state updates (via .subscribe)
// - This file only creates the actor — it does not start or listen to it

export const deviceActor = createActor(deviceMachine);
