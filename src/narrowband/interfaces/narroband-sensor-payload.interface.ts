export interface NarrowbandSensorPayload {
	imei: string;
	data: [{
		tm: number; // Time
		gp?: string; // GPS
		wi?: string; // Wifi
		st?: number; // Cumulative Steps
		ba?: number; // Battery
		sn?: number; // Signal Strength
		wn?: number; // Alarm Type
	}];
}


