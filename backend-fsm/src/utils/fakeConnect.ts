import { fromPromise } from 'xstate';

export const connectActor = fromPromise(
  async ({ input: id }: { input: string }) => {
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    // 10% success rate
    const success = Math.random() < 0.5;
    
    if (success) {
      return 'connected';
    }
    
    // Must throw to trigger onError
    throw new Error(`Connection failed for ${id}`);
  }
);