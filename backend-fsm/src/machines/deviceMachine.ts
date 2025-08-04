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
  /** @xstate-layout N4IgpgJg5mDOIC5QTANwJYGMwDpMHsA7QsTAF3UKgGIIjdLV8BrXFDbPIk8yqBRvkwBDCkQDaABgC6U6YlAAHfLHRjCCkAA9EAJgDsARhySAzLsOHdADgBsu05ICc+2wBoQAT0SHT1nACsAXa++gAszpJWAL7RHuxYuATEpBRU1GAATpn4mTiKADaiAGa5ALY4CZzJPGn8giLqcnKayqrqmjoIBsZmFlZ2Ds6uHt7d5jhh1pIBupLWRk7mTrqx8WiJOJlgZJmefNRasGSiuMLFZFkAFIaSdwCUtBuc27v7VC1IIG1q6ESdeiMJnMlhs9kcLncXh81gCgUMTgCtn0jlsYUM+kktjWICquFeewORxOlxw50umRud0kjzxWx2hI+hnkXx+HS+XRRkkmZmsESctlMvgCplGejCThw1jmYQCLic1j8hjCOLpihy2FgqnSdBIOEErEqz1w6qEcG19UITEaf0IzRkrRUv3+HMQXJ5fn5guFouhCFucP0S2cBhFpkxrlVxvyGvNByyOTyhRK5SNHBNsa1fAEVqEolt9pZSid7NAnMcHr5zm9phFYv9sxw+gCETC3usHds9licRAhHwKHgXzxjvatoBCAAtFCxpO4U4F4ul0vTFH01wUrwqKPnRpXQgwrp63N-LoRV3IcE-AF9GvNgT3lAd6XtIgRfp4XZZU5ZUFEcepkCFtZgVH97EMFs704U1NQtZ9x33CV-AXMJTHRJFbD6LF60sUwcERAwVn0awXEkGxDCgpJ8DKQodjAeCXTLRABVsSYFmsAZJAiZEAnrDicEMBZHAGMIwiDINKJwYphHQApIAYvcmIQFi2OIzjuObY9bgE2EnCsXRZUw8IAh7aIgA */
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
    },
  },
});
