import { createMachine, assign, fromPromise } from 'xstate';

/* ──────────────── Services ──────────────── */
const connectService = fromPromise(async ({ input }: { input: string }) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 30% success rate
  if (Math.random() < 0.3) {
    return 'connected';
  }
  
  throw new Error(`Connection failed for ${input}`);
});

const processingService = fromPromise(async ({ input }: { input: string }) => {
  console.log(`⚙️ Starting processing on ${input}...`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`✅ Processing completed on ${input}`);
  return 'processed';
});

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
    maxRetries: 3
  },

  states: {
    connecting: {
      invoke: {
        src: connectService,
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
        src: processingService,
        input: ({ context }) => context.deviceId,
        onDone: { target: 'complete' },
        onError: { target: 'failed' }
      }
    },

    complete: {
      entry: ({ context }) => console.log(`🏁 Device ${context.deviceId} completed successfully!`)
    },

    failed: {
      entry: ({ context }) => console.log(`💀 Device ${context.deviceId} failed after ${context.retryCount} attempts`)
    }
  }
});