import { createActor } from 'xstate';
import { deviceMachine } from './deviceMachine';
import { allDevices } from '../../../config/layout.config'; // adjust path as needed

export function initDeviceActors() {
	const actors: Record<string, ReturnType<typeof createActor>> = {};

	for (const device of allDevices) {
		const actor = createActor(deviceMachine, {
			input: { machineId: device.id }
		});

		actor.subscribe((state) => {
			console.log(`[${device.id}] state: ${state.value}`);
		});

		actor.start();
		actors[device.id] = actor;
	}

	return actors;
}
