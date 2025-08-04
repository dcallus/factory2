import { setup, assign } from "xstate";
import { connectActor } from "../utils/fakeConnect";
import { processingActor } from "../utils/fakeProcessing";

/* ──────────────── Device Machine ──────────────── */
/** @xstate-layout N4IgpgJg5mDOIC5QTANwJYGMwDpMHsA7QsTAF3UKgGIIjdLV8BrXFDbPIk8yqBRvkwBDCkQDaABgC6U6YlAAHfLHRjCCkAA9EAJgDsARhxHJugJySAbId0AWAByGAzHYA0IAJ6IXDnAFZ-Bxt-SUN9c2DdBwBfGI92LFwCYlIKKmowACcs-CycRQAbUQAzPIBbHETOFJ50-kERdTk5TWVVdU0dBANjUwtrW0cXdy89Z10cR0k7Kwd9XVdzV2c4hLQknCywMizPPmotWDJRXGESsmyACkNJO4BKWg3Obd39qlakEHa1dCIuvRGEy3AY2exOVwebwIQwOfwBQzmfx2WH6ST6ZyRKxrEDVXCvPYHI4nS44c6XLI3O6SR54rY7QkfQzyL4-TpfboY4xWWbOQy3ZxmOz+cxQvR2cwBeaGfy6AxWXT8ww4umKXLYWCqDJ0Eg4QSsKrPXBqoRwLUNQhMJp-QgtGRtFS-f4cxBcnA8qx8gVCkVimGSeERQUOYXmBaSZyylVGgrqs0HbK5fJFUoVQ0cY1xzV8ASWoSiG12llKR3s0Ccvnu3n8iM+0VjGGykzImaScwuML6YJxeIgQj4FDwL54h0dG0AhAAWisfsn8PMC8XS6Xq17dNqaT4o6dGhdCDsuj9ukkfjMEf8fNc8wcM2jGfpby3rNL473F-0OEiaP0RkMnuCM4NuCOATLYhh2CeTh2Hy+h3psJoaua25ltoiASpKmIzJGIp-vo0F+vyzifrKN7oiKuhzCicE1Pg5RFDsYDIa+5aIOYVhWCBnrhD+B5WEYfpODgqIWCGCp8p65jUbgJTCOghSQExzosQgbEcc4XE-nhFH8UBbbEboIrscKJEhj2MRAA */
/** To view FlowChart: Click `Open Visual Editor` Below in VSCode
 *  Or Ctrl + Shift + P > XSTATE: Open Visual Editor  */
export const deviceMachine = setup({
  actors: {
    connectActor,
    processingActor,
  },

  actions: {
    incrementRetryCount: assign({
      retryCount: ({ context }) => context.retryCount + 1,
    }),

    logComplete: ({ context }) =>
      console.log(`🏁 Device ${context.deviceId} completed successfully!`),

    logFailed: ({ context }) =>
      console.log(`💀 [${context.deviceId}] Failed to connect`),
  },

  guards: {
    canRetry: ({ context }) => context.retryCount < context.maxRetries,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QTANwJYGMwDpMHsA7QsTAF3UKgGIIjdLV8BrXFDbPIk8yqBRvkwBDCkQDaABgC6U6YlAAHfLHRjCCkAA9EAJgAcARhwB2Q5IDMkk7pP6AnAFYLhgDQgAnokOH7Oe-r6ACz6FiYWQRZOtgC+Me7sWLgExKQUVNRgAE5Z+Fk4igA2ogBmeQC2OImcKTzp-IIi6nJymsqq6po6CAbGZpbWtg7Obp6IQQY4joYAbIaOkkELQTMmjnEJaEk4WWBkWR581FqwZKK4wiVk2QAU5pKSAJS0W5y7+4dUrUgg7WroRC6eiMpnMVhsdicLncXgQFhBjkRukk9kWjiMsyCGxA1Vw7wORxOZ2uOEu1yydweTxeHDxewJX0M8h+f06P26JiCxhmK10MwM9k5wUcMMQ8L8MzCEX0ugsukcQRRWPiONeuEUuWwsFUGToJBwglYVTVBU1cB1DUITCaAMILRkbRU-0B7MQnO5vP5DiFS1FCHMjlM9isM0RLgsobs2NxpqE5qO2Vy+SKpQqxtpsa1FoEVqEolt9uZSidbNAHK5OB5-K9gpCvrG-sculMCoeM2DM0kulm0ZNJWE6EKkGo5WEhAArsJCgAlekeb7Fjq2oEIGXGexcpb2eUDEwzP184zWFZWVGSxbzOIqwj4FDwH64x1Ll1lxAAWn3DY-vYztTSfCfZ0NFdBAJj9QxdGbYMgiWeVg0kfQTCjFUY3xT4oEA0ttEQBUTH8RDJBmfQFUQ+FRlheF9BwMJDEVQwwhWfQlR-bYNTjbUAJZEtlxAhY-CiRYLAVXR7H5Qx9D9JxqJldsAlsSUghMFianwcoij2MBMJ418EEFGZqPPUT6PRAw-RBcSbCMfkVkkJtlNwftB0gLSX2w3S9wM085iEmUJIbWU8NE4YYIjGwXHWK8gA */
  id: "device",

  initial: "connecting",

  context: {
    deviceId: "device-001",
    retryCount: 0,
    maxRetries: 3, // 3 retries = 4 total attempts (1 initial + 3 retries)
  },

  states: {
    connecting: {
      invoke: {
        src: "connectActor",
        input: ({ context }) => context.deviceId,

        onDone: {
          target: "processing",
        },

        onError: {
          target: "retrying",
          actions: "incrementRetryCount",
        },
      },
    },

    retrying: {
      after: {
        1000: [
          {
            target: "connecting",
            guard: "canRetry",
          },
          {
            target: "failed",
          },
        ],
      },
    },

    processing: {
      invoke: {
        src: "processingActor",
        input: ({ context }) => context.deviceId,
        onDone: { target: "complete" },
        onError: { target: "failed" },
      },
    },

    complete: {
      entry: "logComplete",
    },

    failed: {
      entry: "logFailed",

      on: {
        manualRetry: {
          target: "connecting",
          reenter: true
        }
      }
    }
  },
});
