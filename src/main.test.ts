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
