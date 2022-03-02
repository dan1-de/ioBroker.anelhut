export class MockLogger implements ioBroker.Logger {
	//eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor() {}
	silly(message: string): void {
		console.log("[SILLY] " + message);
	}
	debug(message: string): void {
		console.log("[DEBUG] " + message);
	}
	info(message: string): void {
		console.log("[INFO] " + message);
	}
	warn(message: string): void {
		console.log("[WARN] " + message);
	}
	error(message: string): void {
		console.log("[ERROR] " + message);
	}
	public level: ioBroker.LogLevel = "debug";
}
