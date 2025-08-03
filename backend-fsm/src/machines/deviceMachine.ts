import { createMachine } from 'xstate';

// Defines the device state machine:
// - States = named modes the device can be in (e.g. 'idle', 'running')
//   Defined as keys inside the 'states' object
// - Events = signals sent to the machine to trigger transitions (e.g. { type: 'START' })
// - Transitions = rules that move between states in response to events (e.g. on: { START: 'running' })
// - Actions = internal side effects (e.g. logging) triggered on state entry/exit
// - External effects (e.g. hardware, DB calls) should be handled via subscriptions outside the machine


type DeviceContext = {
	machineId: string;
};

type DeviceEvents =
	| { type: 'START' }
	| { type: 'COMPLETE' };

type DeviceInput = {
	machineId: string;
};

export const deviceMachine = createMachine({
	id: 'device',
	types: {
		context: {} as DeviceContext,
		input: {} as DeviceInput,
		events: {} as DeviceEvents
	},
	context: ({ input }) => ({
		machineId: input.machineId
	}),
	initial: 'idle',
	states: {
		idle: {
			on: {
				START: 'running'
			}
		},
		running: {
			entry: ({ context }) => {
				console.log(`[device ${context.machineId}] running`);
			},
			on: {
				COMPLETE: 'complete'
			}
		},
		complete: {
			entry: ({ context }) => {
				console.log(`[device ${context.machineId}] complete`);
			},
			type: 'final'
		}
	}
});
