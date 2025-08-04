import { fromPromise } from 'xstate';

export const processingActor = fromPromise(
  async ({ input: deviceId }: { input: string }) => {
    console.log(`⚙️ Starting processing on ${deviceId}...`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For now, processing always succeeds
    // In the future, you could add failure logic here
    console.log(`✅ Processing completed on ${deviceId}`);
    return 'processed';
  }
);