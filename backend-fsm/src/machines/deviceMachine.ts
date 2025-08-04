import { createMachine, assign } from 'xstate';
import { connectActor } from '../utils/fakeConnect';
import { processingActor } from '../utils/fakeProcessing';

/* ──────────────── Types ──────────────── */
type DeviceContext = {
  deviceId: string;
  retryCount: number;
  maxRetries: number;
};

/* ──────────────── Device Machine ──────────────── */
export const deviceMachine = createMachine({
  id: 'device',
  
  types: {
    context: {} as DeviceContext
  },

  initial: 'connecting',

  context: {
    deviceId: 'device-001',
    retryCount: 0,
    maxRetries: 3  // 3 retries = 4 total attempts (1 initial + 3 retries)
  },

  states: {
    connecting: {
      invoke: {
        src: connectActor,
        input: ({ context }) => context.deviceId,
        
        onDone: {
          target: 'processing'
        },
        
        onError: {
          target: 'retrying',
          actions: assign({
            retryCount: ({ context }) => context.retryCount + 1
          })
        }
      }
    },

    retrying: {
      after: {
        1000: [
          {
            target: 'connecting',
            guard: ({ context }) => context.retryCount < context.maxRetries
          },
          {
            target: 'failed'
          }
        ]
      }
    },

    processing: {
      invoke: {
        src: processingActor,
        input: ({ context }) => context.deviceId,
        onDone: { target: 'complete' },
        onError: { target: 'failed' }
      }
    },

    complete: {
      entry: ({ context }) => console.log(`🏁 Device ${context.deviceId} completed successfully!`)
    },

    failed: {
      entry: ({ context }) => console.log(`💀 [${context.deviceId}] Failed to connect`)
    }
  }
});