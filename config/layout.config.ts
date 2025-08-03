// Shared enclosure config used by both backend and frontend
import { LayoutDirection, generateDeviceLayout } from './generateDeviceLayout';

export const layoutConfig = {
	devicesPerEnclosure: 15,
	rows: 2,
	columns: 4,
	direction: 'horizontal' as LayoutDirection
};

export const allDevices = generateDeviceLayout(layoutConfig);