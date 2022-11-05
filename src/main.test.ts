/**
 * This is a dummy TypeScript test file using chai and mocha
 *
 * It's automatically excluded from npm and its build output is excluded from both git and npm.
 * It is advised to test all your modules with accompanying *.test.ts-files
 */

import assert from "assert";
import { AnelHutCommunication } from "./AnelHutCommunication";
import { MockLogger } from "./loggerMock";

// run tests with: npm run test:ts

describe("Message Decode Tests", () => {
	it("Decode NET-PwrCtrl HUT without sensor", () => {
		const udpMessage =
			"NET-PwrCtrl:NET-CONTROL-1 :192.168.178.30:255.255.255.0:192.168.178.1:0.4.163.19.11.39:NR1,0:NR2,0:NR3,0:NR4,0:NR5,0:NR6,0:NR7,0:NR8,0:0:80:IO1,1,1:IO2,1,1:IO3,1,1:IO4,1,1:IO5,1,1:IO6,1,1:IO7,1,1:IO8,1, \
			1:22.3�C:NET-PWRCTRL_06.5:h:n:xor:";
		const communication = new AnelHutCommunication("192.168.178.30", 77, 75, "", "", new MockLogger(), false);
		const HutdataResponse = communication.DecodeMessage(udpMessage);
		communication.CloseSocket();
		const ExpectedResponseJson =
			"{'DeviceType':'NET-PwrCtrl','DeviceName':'NET-CONTROL-1','IP':'192.168.178.30','Netmask':'255.255.255.0','Gateway':'192.168.178.1','MacAdress':'00:04:A3:13:0B:27','Relais':[{'RelaisNumber':1,'Name':'NR1','Status':0},{'RelaisNumber':2,'Name':'NR2','Status':0},{'RelaisNumber':3,'Name':'NR3','Status':0},{'RelaisNumber':4,'Name':'NR4','Status':0},{'RelaisNumber':5,'Name':'NR5','Status':0},{'RelaisNumber':6,'Name':'NR6','Status':0},{'RelaisNumber':7,'Name':'NR7','Status':0},{'RelaisNumber':8,'Name':'NR8','Status':0}],'Blocked':0,'HttpPort':80,'Temperature':22.3,'Type':'HUT','IO':[{'IONumber':1,'IOName':'IO1','IODirection':1,'Status':1},{'IONumber':2,'IOName':'IO2','IODirection':1,'Status':1},{'IONumber':3,'IOName':'IO3','IODirection':1,'Status':1},{'IONumber':4,'IOName':'IO4','IODirection':1,'Status':1},{'IONumber':5,'IOName':'IO5','IODirection':1,'Status':1},{'IONumber':6,'IOName':'IO6','IODirection':1,'Status':1},{'IONumber':7,'IOName':'IO7','IODirection':1,'Status':1},{'IONumber':8,'IOName':'IO8','IODirection':1,'Status':1}],'Firmware':'NET-PWRCTRL_06.5','PowerMeasurement':false,'Sensor_1_Ready':false,'XOR_USER_Password':true}";
		assert.equal(ExpectedResponseJson, JSON.stringify(HutdataResponse).replace(/"/g, "'"));
	});
	it("Decode NET-PwrCtrl HUT with sensor", () => {
		const udpMessage =
			"NET-PwrCtrl:NET-CONTROL-2 :192.168.178.20:255.255.255.0:192.168.178.1:0.4.163.20.6.70:NR1,0:NR2,0:NR3,0:NR4,0:NR5,0:NR6,0:NR7,0:NR8,0:0:80:IO1,1,1:IO2,1,1:IO3,1,1:IO4,1,1:IO5,1,1:IO6,1,1:IO7,1,1:IO8,1,1:22.5▒C:NET-PWRCTRL_06.5:h:n:s:17.61:53.2:28:xor:";
		const communication = new AnelHutCommunication("192.168.178.30", 77, 75, "", "", new MockLogger(), false);
		const HutdataResponse = communication.DecodeMessage(udpMessage);
		communication.CloseSocket();
		const ExpectedResponseJson =
			"{'DeviceType':'NET-PwrCtrl','DeviceName':'NET-CONTROL-2','IP':'192.168.178.20','Netmask':'255.255.255.0','Gateway':'192.168.178.1','MacAdress':'00:04:A3:14:06:46','Relais':[{'RelaisNumber':1,'Name':'NR1','Status':0},{'RelaisNumber':2,'Name':'NR2','Status':0},{'RelaisNumber':3,'Name':'NR3','Status':0},{'RelaisNumber':4,'Name':'NR4','Status':0},{'RelaisNumber':5,'Name':'NR5','Status':0},{'RelaisNumber':6,'Name':'NR6','Status':0},{'RelaisNumber':7,'Name':'NR7','Status':0},{'RelaisNumber':8,'Name':'NR8','Status':0}],'Blocked':0,'HttpPort':80,'Temperature':22.5,'Type':'HUT','IO':[{'IONumber':1,'IOName':'IO1','IODirection':1,'Status':1},{'IONumber':2,'IOName':'IO2','IODirection':1,'Status':1},{'IONumber':3,'IOName':'IO3','IODirection':1,'Status':1},{'IONumber':4,'IOName':'IO4','IODirection':1,'Status':1},{'IONumber':5,'IOName':'IO5','IODirection':1,'Status':1},{'IONumber':6,'IOName':'IO6','IODirection':1,'Status':1},{'IONumber':7,'IOName':'IO7','IODirection':1,'Status':1},{'IONumber':8,'IOName':'IO8','IODirection':1,'Status':1}],'Firmware':'NET-PWRCTRL_06.5','PowerMeasurement':false,'Sensor_1_Ready':true,'Sensor_1_Temperature':17.61,'Sensor_1_Humidity':53.2,'Sensor_1_Brightness':28,'XOR_USER_Password':true}";
		assert.equal(ExpectedResponseJson, JSON.stringify(HutdataResponse).replace(/"/g, "'"));
	});
	it("Decode NetPwrCtrl Pro v3", () => {
		const udpMessage =
			"NET-PwrCtrl:BUERO          :192.168.55.48:255.255.255.0:192.168.55.1:0.4.163.10.3.50:Switch Bro 1,1:Monitore auen,1:Nr. 3,0:Laptop,0:Lautsprecher,1:PC,1:Monitor Mitte,1:Tischlampe,0:33:80";
		const communication = new AnelHutCommunication("192.168.55.48", 77, 75, "", "", new MockLogger(), false);
		const HutdataResponse = communication.DecodeMessage(udpMessage);
		communication.CloseSocket();
		const ExpectedResponseJson =
			"{'DeviceType':'NET-PwrCtrl','DeviceName':'BUERO','IP':'192.168.55.48','Netmask':'255.255.255.0','Gateway':'192.168.55.1','MacAdress':'00:04:A3:0A:03:32','Relais':[{'RelaisNumber':1,'Name':'Switch Bro 1','Status':1},{'RelaisNumber':2,'Name':'Monitore auen','Status':1},{'RelaisNumber':3,'Name':'Nr. 3','Status':0},{'RelaisNumber':4,'Name':'Laptop','Status':0},{'RelaisNumber':5,'Name':'Lautsprecher','Status':1},{'RelaisNumber':6,'Name':'PC','Status':1},{'RelaisNumber':7,'Name':'Monitor Mitte','Status':1},{'RelaisNumber':8,'Name':'Tischlampe','Status':0}],'Blocked':33,'HttpPort':80,'Temperature':-127,'Type':'P'}";
		assert.equal(ExpectedResponseJson, JSON.stringify(HutdataResponse).replace(/"/g, "'"));
	});
	it("Decode Example from github issues/27", () => {
		const udpMessage =
			"NET-PwrCtrl:NET-CONTROL :192.168.30.7:255.255.255.0:192.168.30.254:0.4.163.20 .3.118:Modem,1:Firewall,1:Unifi Switch,1:frei,1:Raspimatic,1:Weatherman,1:Sonos, 1:Dayton,0:0:80:IO.1,0,0:IO.2,0,0:IO.3,0,0:IO.4,0,0:IO.5,0,0:IO.6,0,0:IO.7,0,0:I O.8,0,0:24.7▒C:NET-PWRCTRL_07.1:a:n:xor:";
		const communication = new AnelHutCommunication("192.168.55.48", 77, 75, "", "", new MockLogger(), false);
		const HutdataResponse = communication.DecodeMessage(udpMessage);
		console.log(JSON.stringify(HutdataResponse));
		communication.CloseSocket();
		const ExpectedResponseJson =
			"{'DeviceType':'NET-PwrCtrl','DeviceName':'NET-CONTROL','IP':'192.168.30.7','Netmask':'255.255.255.0','Gateway':'192.168.30.254','MacAdress':'00:04:A3:14:03:76','Relais':[{'RelaisNumber':1,'Name':'Modem','Status':1},{'RelaisNumber':2,'Name':'Firewall','Status':1},{'RelaisNumber':3,'Name':'Unifi Switch','Status':1},{'RelaisNumber':4,'Name':'frei','Status':1},{'RelaisNumber':5,'Name':'Raspimatic','Status':1},{'RelaisNumber':6,'Name':'Weatherman','Status':1},{'RelaisNumber':7,'Name':'Sonos','Status':1},{'RelaisNumber':8,'Name':'Dayton','Status':0}],'Blocked':0,'HttpPort':80,'Temperature':24.7,'Type':'ADV','IO':[],'Firmware':'NET-PWRCTRL_07.1','PowerMeasurement':false,'Sensor_1_Ready':false,'XOR_USER_Password':true}";
		assert.equal(ExpectedResponseJson, JSON.stringify(HutdataResponse).replace(/"/g, "'"));
	});
});
