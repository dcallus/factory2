export type LayoutDirection = 'horizontal' | 'vertical';

interface EnclosureConfig {
	devicesPerEnclosure: number;
	rows: number;
	columns: number;
	direction: LayoutDirection;
}

interface DeviceConfig {
	id: string;
	enclosure: string;
	position: number;
	row: number;
	column: number;
}

export function generateDeviceLayout(config: EnclosureConfig): DeviceConfig[] {
	const {
		devicesPerEnclosure,
		rows,
		columns,
		direction
	} = config;

	const devices: DeviceConfig[] = [];

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < columns; c++) {
			const enclosureLetter = String.fromCharCode(97 + (direction === 'horizontal'
				? r * columns + c
				: c * rows + r));

			for (let i = 1; i <= devicesPerEnclosure; i++) {
				devices.push({
					id: `device-${enclosureLetter}-${String(i).padStart(2, '0')}`,
					enclosure: enclosureLetter,
					position: i,
					row: r,
					column: c
				});
			}
		}
	}

	return devices;
}
