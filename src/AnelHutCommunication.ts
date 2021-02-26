import { Subject } from "rxjs";
import { HutData, IOState, Relais } from "./HutData";
import dgram = require("dgram");

export class AnelHutCommunication {
	private socket: any;
	private hostIpAdress: string;
	private user: string;
	private password: string;
	private udpRecievePort: number;
	private udpSendPort: number;
	private HutStatusObservable: Subject<any> = new Subject<any>();
	private logger: ioBroker.Logger;

	constructor(
		hostIpAdress: string,
		udpRecievePort: number,
		udpSendPort: number,
		user: string,
		password: string,
		logger: ioBroker.Logger,
	) {
		this.socket = dgram.createSocket("udp4");
		this.hostIpAdress = hostIpAdress;
		this.user = user;
		this.password = password;
		this.udpRecievePort = udpRecievePort;
		this.udpSendPort = udpSendPort;
		this.logger = logger;

		this.socket.bind(udpRecievePort);

		this.socket.on("listening", () => {
			// const broadcastAddress = "192.168.178.255";
			const broadcastAddress = "255.255.255.255";
			const data = Buffer.from("wer da?");
			this.socket.setBroadcast(true);
			this.socket.setMulticastTTL(128);
			this.socket.send(data, udpSendPort, broadcastAddress);
		});

		this.socket.on("message", (message, remote) => {
			// console.log("New Message from: " + remote.address + ":" + remote.port + " - " + message);
			if (remote.address == this.hostIpAdress) {
				const Hutdata = this.DecodeMessage(message);
				if (Hutdata != undefined && Hutdata.IP != undefined && Hutdata.IP == this.hostIpAdress) {
					Hutdata.LastUpdate = new Date().toLocaleString();
					this.HutStatusObservable.next(Hutdata);
				}
			}
		});

		this.socket.on("error", (err) => {
			this.logger.error(`UDP Server Error: ${err.stack}`);
			this.socket.close();
		});
	}

	private static keyCharAt(key, i): number {
		return key.charCodeAt(Math.floor(i % key.length));
	}

	private static xor_encrypt(key, data): any {
		return Array.prototype.map.call(data, (c, i) => {
			return c.charCodeAt(0) ^ this.keyCharAt(key, i);
		});
	}

	private static EncryptUserPassword(data, key): any {
		data = this.xor_encrypt(key, data);
		return this.b64_encode(data);
	}

	private static b64_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	private static b64_encode(data): any {
		let o1,
			o2,
			o3,
			h1,
			h2,
			h3,
			h4,
			bits,
			i = 0,
			enc = "";
		if (!data) {
			return data;
		}
		do {
			o1 = data[i++];
			o2 = data[i++];
			o3 = data[i++];
			bits = (o1 << 16) | (o2 << 8) | o3;
			h1 = (bits >> 18) & 0x3f;
			h2 = (bits >> 12) & 0x3f;
			h3 = (bits >> 6) & 0x3f;
			h4 = bits & 0x3f;
			enc +=
				this.b64_table.charAt(h1) +
				this.b64_table.charAt(h2) +
				this.b64_table.charAt(h3) +
				this.b64_table.charAt(h4);
		} while (i < data.length);
		const r = data.length % 3;
		return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
	}

	//encryption is currently not working
	public Switch(relaisNumber: number, newState: number, encrypt = false): void {
		let command = "";
		if (newState == 0) {
			command = "Sw_off" + relaisNumber;
		} else if (newState == 1) {
			command = "Sw_on" + relaisNumber;
		} else {
			console.log("Invalid command");
			return;
		}

		const user_password = this.user + this.password;
		const encr_user_password = AnelHutCommunication.EncryptUserPassword(user_password, this.password) + "\0";
		console.log("EncrPasswd: " + encr_user_password);
		let bef;

		if (encrypt) {
			bef = command + encr_user_password; //for example: Sw_on1ASfdhhgfDS
		} else {
			bef = command + user_password; //for example: Sw_on1adminanel
		}

		const client = dgram.createSocket("udp4");
		client.send(bef, this.udpSendPort, this.hostIpAdress, (err) => {
			this.logger.error("Error while sending command to hut: " + err);
			client.close();
		});
	}

	public SubscribeStatusUpdates(): Subject<any> {
		return this.HutStatusObservable;
	}

	private static ConvertMacNumbersToHexString(mac: string): string {
		let result = "";
		const macAdrParts = mac.split(".");
		if (macAdrParts == undefined || macAdrParts.length < 6) {
			return mac;
		}
		let i = 0;
		macAdrParts.forEach((part) => {
			const valueNumber = Number(part);
			let hexValue = valueNumber.toString(16).toUpperCase();
			if (hexValue.length < 2) {
				hexValue = "0" + hexValue;
			}
			if (i == macAdrParts.length - 1) {
				result += hexValue;
			} else {
				result += hexValue + ":";
			}
			i++;
		});
		return result;
	}

	private DecodeMessage(message: string): HutData {
		const hutData = new HutData();
		if (message == undefined || message == "") {
			//error
			this.logger.error("Decode Message Error: No valid hut message");
			return hutData;
		}
		const messageParts = message.toString().split(":");

		if (messageParts[0] != "NET-PwrCtrl") {
			//error
			this.logger.error("Decode Message Error: Invalid Device no NET-PwrCtrl");
			return hutData;
		}

		if (messageParts[2] == "NoPass") {
			// const nopass = messageParts[1];
			//error
			this.logger.error("Decode Message Error: NoPass");
			return hutData;
		}

		hutData.DeviceType = messageParts[0];
		hutData.DeviceName = messageParts[1].trim();
		hutData.IP = messageParts[2];
		hutData.Netmask = messageParts[3];
		hutData.Gateway = messageParts[4];

		hutData.MacAdress = AnelHutCommunication.ConvertMacNumbersToHexString(messageParts[5]);

		// Relais
		const RelaisList: Array<Relais> = new Array<Relais>();
		for (let i = 0; i < 8; i++) {
			const name_split = messageParts[6 + i].split(",");
			RelaisList.push(new Relais(i + 1, name_split[0], Number(name_split[1])));
		}
		hutData.Relais = RelaisList;

		hutData.Blocked = Number(messageParts[14]);
		hutData.HttpPort = Number(messageParts[15]);
		hutData.Temperature = -127; // ??

		if (messageParts[16].startsWith("NET-PWRCTRL") == true) {
			hutData.Type = messageParts[17];
			hutData.XOR_USER_Password = false;
			if (messageParts[18] == "xor") {
				hutData.XOR_USER_Password = true;
			}
		} else {
			if (hutData.Blocked >= 248) {
				hutData.Type = "H";
			} else {
				hutData.Type = "P";
			}
		}

		// IO Part:
		if (messageParts.length > 20) {
			const IOList: Array<IOState> = new Array<IOState>();
			//IO
			for (let i = 0; i < 8; i++) {
				const name_split = messageParts[16 + i].split(",");
				IOList.push(new IOState(i + 1, name_split[0], Number(name_split[1]), Number(name_split[2])));
			}
			hutData.IO = IOList;

			const temp: string = messageParts[24].substr(0, messageParts[24].length - 2);
			hutData.Temperature = Number(temp.replace(".", ","));
			hutData.Firmware = messageParts[25];

			//since FW 6.0
			if (messageParts.length > 26) {
				hutData.Type = messageParts[26];

				//--------------------------------------------------------------------------------
				//Typ { a = ADV; i = IO; h = HUT; o = ONE; f = ONE-F; H = Home; P = PRO}
				//--------------------------------------------------------------------------------

				//Power
				hutData.PowerMeasurement = false;
				if (messageParts[27] == "p") {
					const start = 28;
					hutData.VoltageRMS = Number(messageParts[start].replace(".", ","));
					hutData.CurrentRMS = Number(messageParts[start + 1].replace(".", ","));
					hutData.LineFrequency = Number(messageParts[start + 2].replace(".", ","));
					hutData.ActivePower = Number(messageParts[start + 3].replace(".", ","));
					hutData.ApparentPower = Number(messageParts[start + 4].replace(".", ","));
					hutData.ReactivePower = Number(messageParts[start + 5].replace(".", ","));
					hutData.PowerFactor = Number(messageParts[start + 6].replace(".", ","));

					hutData.PowerMeasurement = true;
				}

				//Sensor 1
				hutData.Sensor_1_Ready = false;
				if (messageParts[messageParts.length - 6] == "s") {
					hutData.Sensor_1_Ready = true;
					hutData.Sensor_1_Temperature = Number(messageParts[messageParts.length - 5].replace(".", ","));
					hutData.Sensor_1_Humidity = Number(messageParts[messageParts.length - 4].replace(".", ","));
					hutData.Sensor_1_Brightness = Number(messageParts[messageParts.length - 3].replace(".", ","));
				}

				hutData.XOR_USER_Password = false;
				if (messageParts[messageParts.length - 2] == "xor") {
					hutData.XOR_USER_Password = true;
				}
			}
		}
		return hutData;
	}
}
