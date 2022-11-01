"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockLogger = void 0;
class MockLogger {
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
        this.level = "debug";
    }
    silly(message) {
        console.log("[SILLY] " + message);
    }
    debug(message) {
        console.log("[DEBUG] " + message);
    }
    info(message) {
        console.log("[INFO] " + message);
    }
    warn(message) {
        console.log("[WARN] " + message);
    }
    error(message) {
        console.log("[ERROR] " + message);
    }
}
exports.MockLogger = MockLogger;
