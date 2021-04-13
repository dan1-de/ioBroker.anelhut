"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOState = exports.Relais = exports.HutData = void 0;
class HutData {
}
exports.HutData = HutData;
class Relais {
    constructor(RelaisNumber, Name, Status) {
        this.RelaisNumber = RelaisNumber;
        this.Name = Name;
        this.Status = Status;
    }
}
exports.Relais = Relais;
class IOState {
    constructor(IONumber, IOName, IODirection, Status) {
        this.IONumber = IONumber;
        this.IOName = IOName;
        this.IODirection = IODirection;
        this.Status = Status;
    }
}
exports.IOState = IOState;
