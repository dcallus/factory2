import { setup, assign } from 'xstate';
import { connectActor } from '../utils/fakeConnect';
import { processingActor } from '../utils/fakeProcessing';

/* ──────────────── Types ──────────────── */
type DeviceContext = {
  deviceId: string;
  retryCount: number;
  maxRetries: number;
};

/* ──────────────── Device Machine ──────────────── */
export const deviceMachine = setup({
  types: {
    context: {} as DeviceContext
  },
  
  actors: {
    connectActor,
    processingActor
  },
  
  actions: {
    incrementRetryCount: assign({
      retryCount: ({ context }) => context.retryCount + 1
    }),
    
    logComplete: ({ context }) => 
      console.log(`🏁 Device ${context.deviceId} completed successfully!`),
    
    logFailed: ({ context }) => 
      console.log(`💀 [${context.deviceId}] Failed to connect`)
  },
  
  guards: {
    canRetry: ({ context }) => context.retryCount < context.maxRetries
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QTANwJYGMwDpMHsA7QsTAF3UKgGIIjdLV8BrXFDbPIk8yqBRvkwBDCkQDaABgC6U6YlAAHfLHRjCCkAA9EAJgDsARhxHJugBwA2QwBZz5mwE5HAVgA0IAJ6JDAZkc4lpJmLrqONi761r4uAL6xHuxYuATEpBRU1GAATtn42TiKADaiAGb5ALY4SZypPBn8giLqcnKayqrqmjoIBsamFtZ2Ds7uXnq+xja+5vqOho5D+pK28YloyTjZYGTZnnzUWrBkorjCpWQ5ABSGwZIAlLQbnNu7+1RtSCAdauhE3XojCZboNbPYnK4PN4EIYHDgbPp9OZIpIgoZlqE1iAarhXnsDkcTpccOdLtkbndHjitjt8R9DPIvj8ul8evpJoEbJZdC5FrcbLpDGNoboETgXJJfEjLPonH1zLosdTFHlsLBVJk6CQcIJWNVnrgVUI4BrGoQmM0-oRWjJ2ipfv9WYh2cZLFyeXzJAKhVCfJIXCZHL5JPoDLNLLMuUqDYVVSaDjk8gVimVKvqOIa4+q+AJzUJRFabYylPaWaA2Ry3dzedYvYLhT5QiYXDZglF7I5ZoZ4gkQIR8Ch4F8cXbOlaAQgALSWX1TyzRjNcNK8Kijh0aJ0IAWz3T+nBB5ZmRwhuY2GwLzZ495QNdl7SIFxS-ezL3c2azFzmHdcnC6KXmXxuUmUUWwvTgjTVU1b3HTcIRwfwvWCSIDEcAxZ0MPx91CU9eTCR8QzAlJ8AqYodjAaDHXLRBFkseDLGDFxrFCSRkS-cYEHMYxYVDOYFQA0Uo17alSmEdAikgCiNyohAaLohimN3VidxDHArFQ1tJmcV9fB7WIgA */
  id: 'device',

  initial: 'connecting',

  context: {
    deviceId: 'device-001',
    retryCount: 0,
    maxRetries: 3  // 3 retries = 4 total attempts (1 initial + 3 retries)
  },

  states: {
    connecting: {
      invoke: {
        src: 'connectActor',
        input: ({ context }) => context.deviceId,
        
        onDone: {
          target: 'processing'
        },
        
        onError: {
          target: 'retrying',
          actions: 'incrementRetryCount'
        }
      }
    },

    retrying: {
      after: {
        1000: [
          {
            target: 'connecting',
            guard: 'canRetry'
          },
          {
            target: 'failed'
          }
        ]
      }
    },

    processing: {
      invoke: {
        src: 'processingActor',
        input: ({ context }) => context.deviceId,
        onDone: { target: 'complete' },
        onError: { target: 'failed' }
      }
    }, 

    complete: {
      entry: 'logComplete'
    },

    failed: {
      entry: 'logFailed'
    }
  }
});