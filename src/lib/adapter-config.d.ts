// This file extends the AdapterConfig type from "@types/iobroker"

import { AnelHutCommunication } from "../AnelHutCommunication";

export class AnelHut {
	DeviceName: string;
	DeviceIP: string;
	UDPSendPort: string;
	UDPRecievePort: string;
	Username: string;
	Password: string;
	UserPasswordXOR: boolean;
	DeviceActive: boolean;
	DeviceConnected: boolean;
	LastUpdateTimestamp: string;
	HutCommunication: AnelHutCommunication;
	RelaisChangeSubscription = false;
	IoChangeSubscription = false;
}

export class RelaisStatus {
	RelaisName: string;
	RelaisNumber: number;
}

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface AdapterConfig {
			getAnelDevices: Array<AnelHut>;
		}
	}
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
