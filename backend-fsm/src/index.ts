// Entry point: starts Express server and all device actors

import express from 'express';
import { layoutConfig } from '../../config/layout.config';
import { initDeviceActors } from './machines/initDeviceActors';

const app = express();
const port = 3000;

// Create device actors and store them by ID
const deviceActorMap = initDeviceActors();

app.use(express.json());

// Health check
app.get('/', (_req, res) => {
	res.send('Backend is running');
});

// Server startup
app.listen(port, () => {
	console.log(`🚀 Server running on http://localhost:${port}`);
});
