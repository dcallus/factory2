import { createMachine, assign } from 'xstate';
import { connectActor } from '../utils/fakeConnect';

/* ──────────────── Types ──────────────── */
type DeviceContext = {
  machineId: string;
  successfulAttempt: number;
};

type DeviceInput = { machineId: string };

type DeviceEvents =
  | { type: 'START' }
  | { type: 'COMPLETE' };

/* ──────────────── Machine ──────────────── */
export const deviceMachine = createMachine({
  id: 'device',

  types: {
    context: {} as DeviceContext,
    input: {} as DeviceInput,
    events: {} as DeviceEvents
  },

  initial: 'attempt1',

  context: ({ input }) => ({
    machineId: input.machineId,
    successfulAttempt: 0 // Will be set when connection succeeds
  }),

  states: {
    /* First attempt */
    attempt1: {
      invoke: {
        src: connectActor,
        input: ({ context }) => context.machineId,
        onDone: { 
          target: 'idle',
          actions: assign({ successfulAttempt: 1 })
        },
        onError: { target: 'attempt2' }
      }
    },

    /* Second attempt */
    attempt2: {
      invoke: {
        src: connectActor,
        input: ({ context }) => context.machineId,
        onDone: { 
          target: 'idle',
          actions: assign({ successfulAttempt: 2 })
        },
        onError: { target: 'attempt3' }
      }
    },

    /* Third attempt */
    attempt3: {
      invoke: {
        src: connectActor,
        input: ({ context }) => context.machineId,
        onDone: { 
          target: 'idle',
          actions: assign({ successfulAttempt: 3 })
        },
        onError: { target: 'error' }
      }
    },

    /* Success - connected */
    idle: {
      on: { 
        START: 'running' 
      }
    },

    running: {
      on: { 
        COMPLETE: 'complete' 
      }
    },

    complete: {
      type: 'final'
    },

    /* Failed all attempts */
    error: {
      // Terminal error state
    }
  }
});