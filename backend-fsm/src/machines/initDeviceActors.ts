// Starts multiple device actors and subscribes to state changes:
// - Subscribing here handles external side effects (e.g. logging, hardware, notifications)
// - Logging is a good example: log inside the machine for internal behaviour (e.g. entering 'running'),
//   and subscribe outside the machine (like here) to observe state changes and react to them
// - Keeps the machine focused on intent, and external code focused on consequences
// - Returns an actor instance so it can be managed or referenced elsewhere

import { createActor } from 'xstate';
import { deviceMachine } from './deviceMachine';

export function initDeviceActors(count = 10) {
	const actors = [];

	for (let i = 1; i <= count; i++) {
		const machineId = `device-${i}`;

		const actor = createActor(deviceMachine, {
			input: { machineId }
		});

		actor.subscribe((state) => {
			console.log(`[${machineId}] state: ${state.value}`);
		});

		actor.start();
		actors.push(actor);
	}

	return actors;
}
