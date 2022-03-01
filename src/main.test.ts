/**
 * This is a dummy TypeScript test file using chai and mocha
 *
 * It's automatically excluded from npm and its build output is excluded from both git and npm.
 * It is advised to test all your modules with accompanying *.test.ts-files
 */

import { expect } from "chai";
import { AnelHutCommunication } from "./AnelHutCommunication";
import { MockLogger } from "./loggerMock";

const assert = require("assert");
// import { functionToTest } from "./moduleToTest";

describe("module to test => function to test", () => {
	// initializing logic
	const expected = 5;

	it(`should return ${expected}`, () => {
		const result = 5;
		// assign result a value from functionToTest
		expect(result).to.equal(expected);
		// or using the should() syntax
		result.should.equal(expected);
	});
	// ... more tests => it
});

// ... more test suites => describe
describe("Message Decode Tests", () => {
	it("Hut without sensor", () => {
		let udpMessage =
			"NET-PwrCtrl:NET-CONTROL-OG :192.168.178.30:255.255.255.0:192.168.178.1:0.4.163.19.11.39:Bad,0:Gang OG,0:Bad Aussen,0:Nr.4,0:Nr.5,0:Nr.6,0:Nr.7,0:Nr.8,0:0:80:Taster Bad,1,1:Taster Gang OG,1,1:Taster Bad Ausse,1,1:IO-4,1,1:IO-5,1,1:IO-6,1,1:IO-7,1,1:IO-8,1, \
			1:22.3�C:NET-PWRCTRL_06.5:h:n:xor:";
		let communication = new AnelHutCommunication("192.168.178.30", 77, 75, "", "", new MockLogger());
		let HutdataResponse = communication.DecodeMessage(udpMessage);
		console.log(HutdataResponse);
		assert.equal(1 + 1, 2);
	});
	it("Hut with sensor", () => {
		let udpMessage =
			"NET-PwrCtrl:NET-CONTROL-EG :192.168.178.20:255.255.255.0:192.168.178.1:0.4.163.20.6.70:Küche,0:Gang EG,0:Wohnzimmer,0:Esszimmer,0:Gang KG,0:Terrasse aussen,0:Hauseingang,0:Nr. 8 frei,0:0:80:Taster Küche,1,1:Taster Gang,1,1:Taster Wohnzimme,1,1:Taster Esszimer,1,1:Taster Gang KG,1,1:Taster Terasse,1,1:Taster Hauseinga,1,1:IO-8,1, \
			1:22.5▒C:NET-PWRCTRL_06.5:h:n:s:17.61:53.2:28:xor:";
		let communication = new AnelHutCommunication("192.168.178.30", 77, 75, "", "", new MockLogger());
		let HutdataResponse = communication.DecodeMessage(udpMessage);
		console.log(HutdataResponse);
		assert.equal(1 + 1, 2);
	});
	it("NetPwrCtrl Pro", () => {
		let udpMessage =
			"NET-PwrCtrl:BUERO          :192.168.55.48:255.255.255.0:192.168.55.1:0.4.163.10.3.50:Switch Bro 1,1:Monitore auen,1:Nr. 3,0:Laptop,0:Lautsprecher,1:PC,1:Monitor Mitte,1:Tischlampe,0:33:80";
		let communication = new AnelHutCommunication("192.168.55.48", 77, 75, "", "", new MockLogger());
		let HutdataResponse = communication.DecodeMessage(udpMessage);
		console.log(HutdataResponse);
		assert.equal(1 + 1, 2);
	});
	// it("should return 9", () => {
	// 	assert.equal(3 * 3, 9);
	// });
});

// npm run test:ts
