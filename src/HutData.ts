export class HutData {
	DeviceType!: string;
	DeviceName!: string;
	IP!: string;
	Netmask!: string;
	Gateway!: string;
	MacAdress!: string;
	Blocked!: number;
	HttpPort!: number;
	Temperature!: number;
	Type!: string;
	XOR_USER_Password!: boolean;
	Firmware!: string;

	PowerMeasurement!: boolean;
	VoltageRMS!: number;
	CurrentRMS!: number;
	LineFrequency!: number;
	ActivePower!: number;
	ApparentPower!: number;
	ReactivePower!: number;
	PowerFactor!: number;

	Sensor_1_Ready!: boolean;
	Sensor_1_Temperature!: number;
	Sensor_1_Humidity!: number;
	Sensor_1_Brightness!: number;

	Relais!: Array<Relais>;
	IO!: Array<IOState>;
	LastUpdate!: string;
}

export class Relais {
	public RelaisNumber: number;
	public Name: string;
	Status: number;
	constructor(RelaisNumber: number, Name: string, Status: number) {
		this.RelaisNumber = RelaisNumber;
		this.Name = Name;
		this.Status = Status;
	}
}

export class IOState {
	IONumber: number;
	IOName: string;
	IODirection: number;
	Status: number;
	constructor(IONumber: number, IOName: string, IODirection: number, Status: number) {
		this.IONumber = IONumber;
		this.IOName = IOName;
		this.IODirection = IODirection;
		this.Status = Status;
	}
}
