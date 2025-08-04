import express from 'express';
import { initDeviceActors } from './machines/initDeviceActors';

const app = express();
const port = 3000;

// Create single device actor
const deviceActor = initDeviceActors();

app.use(express.json());

// Health check
app.get('/', (_req, res) => {
  const state = deviceActor.getSnapshot();
  res.json({
    message: 'Backend is running',
    deviceState: state.value,
    deviceContext: state.context
  });
});

// Manual retry endpoint
app.post('/retry', (_req, res) => {
  deviceActor.send({ type: 'RETRY' });
  res.json({ message: 'Retry sent' });
});

// Reset endpoint  
app.post('/reset', (_req, res) => {
  deviceActor.send({ type: 'RESET' });
  res.json({ message: 'Reset sent' });
});

// Server startup
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});