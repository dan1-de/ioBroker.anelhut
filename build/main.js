"use strict";
/* eslint-disable prettier/prettier */
/*
 * Created with @iobroker/create-adapter v1.31.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = __importStar(require("@iobroker/adapter-core"));
const AnelHutCommunication_1 = require("./AnelHutCommunication");
const HutData_1 = require("./HutData");
// Load your modules here, e.g.:
// import * as fs from "fs";
class Anelhut extends utils.Adapter {
    constructor(options = {}) {
        super({
            ...options,
            name: "anelhut",
        });
        this.on("ready", this.onReady.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        // this.on("objectChange", this.onObjectChange.bind(this));
        // this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }
    async UpdateHutData(device, hutData) {
        await this.setDeviceProperties(device.DeviceName, "DeviceType", "string", hutData.DeviceType);
        await this.setDeviceProperties(device.DeviceName, "DeviceName", "string", hutData.DeviceName);
        await this.setDeviceProperties(device.DeviceName, "Netmask", "string", hutData.Netmask);
        await this.setDeviceProperties(device.DeviceName, "Gateway", "string", hutData.Gateway);
        await this.setDeviceProperties(device.DeviceName, "MacAdress", "string", hutData.MacAdress);
        await this.setDeviceProperties(device.DeviceName, "Blocked", "number", hutData.Blocked);
        await this.setDeviceProperties(device.DeviceName, "HttpPort", "number", hutData.HttpPort);
        await this.setDeviceProperties(device.DeviceName, "Temperature", "number", hutData.Temperature);
        await this.setDeviceProperties(device.DeviceName, "Type", "string", hutData.Type);
        await this.setDeviceProperties(device.DeviceName, "XOR_USER_Password", "boolean", hutData.XOR_USER_Password);
        await this.setDeviceProperties(device.DeviceName, "Firmware", "string", hutData.Firmware);
        await this.setDeviceProperties(device.DeviceName, "PowerMeasurement", "boolean", hutData.PowerMeasurement);
        await this.setDeviceProperties(device.DeviceName, "VoltageRMS", "number", hutData.VoltageRMS);
        await this.setDeviceProperties(device.DeviceName, "CurrentRMS", "number", hutData.CurrentRMS);
        await this.setDeviceProperties(device.DeviceName, "LineFrequency", "number", hutData.LineFrequency);
        await this.setDeviceProperties(device.DeviceName, "ActivePower", "number", hutData.ActivePower);
        await this.setDeviceProperties(device.DeviceName, "ApparentPower", "number", hutData.ApparentPower);
        await this.setDeviceProperties(device.DeviceName, "ReactivePower", "number", hutData.ReactivePower);
        await this.setDeviceProperties(device.DeviceName, "PowerFactor", "number", hutData.PowerFactor);
        await this.setDeviceProperties(device.DeviceName, "Sensor_1_Ready", "boolean", hutData.Sensor_1_Ready);
        await this.setDeviceProperties(device.DeviceName, "Sensor_1_Temperature", "number", hutData.Sensor_1_Temperature);
        await this.setDeviceProperties(device.DeviceName, "Sensor_1_Humidity", "number", hutData.Sensor_1_Humidity);
        await this.setDeviceProperties(device.DeviceName, "Sensor_1_Brightness", "number", hutData.Sensor_1_Brightness);
        // relais part:
        if (hutData.Relais != undefined && hutData.Relais.length > 0) {
            await this.setObjectNotExistsAsync(device.DeviceName + "." + "relais", {
                type: "device",
                common: {
                    name: "relais",
                },
                native: {},
            });
            hutData.Relais.forEach(async (relais) => {
                const deviceName = device.DeviceName + "." + "relais" + "." + relais.RelaisNumber;
                await this.setObjectNotExistsAsync(deviceName, {
                    type: "device",
                    common: {
                        name: relais.RelaisNumber.toString(),
                    },
                    native: {},
                });
                await this.setDeviceProperties(deviceName, "Name", "string", relais.Name);
                await this.setDeviceProperties(deviceName, "Status", "boolean", relais.Status, "switch");
                this.subscribeStates(deviceName + "." + "Status");
            });
        }
        // io part:
        if (hutData.IO != undefined && hutData.IO.length > 0) {
            await this.setObjectNotExistsAsync(device.DeviceName + "." + "io", {
                type: "device",
                common: {
                    name: "io",
                },
                native: {},
            });
            hutData.IO.forEach(async (io) => {
                const deviceName = device.DeviceName + "." + "io" + "." + io.IONumber;
                await this.setObjectNotExistsAsync(deviceName, {
                    type: "device",
                    common: {
                        name: io.IONumber.toString(),
                    },
                    native: {},
                });
                await this.setDeviceProperties(deviceName, "Name", "string", io.IOName);
                await this.setDeviceProperties(deviceName, "Direction", "string", io.IODirection);
                await this.setDeviceProperties(deviceName, "Status", "boolean", io.Status);
            });
        }
    }
    async initializeDevice(device) {
        await this.setObjectNotExistsAsync(device.DeviceName, {
            type: "device",
            common: {
                name: device.DeviceName,
            },
            native: {},
        });
        await this.setDeviceProperties(device.DeviceName, "DeviceIP", "string", device.DeviceIP);
        await this.setDeviceProperties(device.DeviceName, "UDPSendPort", "string", device.UDPSendPort);
        await this.setDeviceProperties(device.DeviceName, "UDPRecievePort", "string", device.UDPRecievePort);
        await this.setDeviceProperties(device.DeviceName, "DeviceActive", "boolean", device.DeviceActive);
        await this.setDeviceProperties(device.DeviceName, "DeviceConnected", "boolean", device.DeviceConnected);
        await this.setDeviceProperties(device.DeviceName, "LastUpdateTimestamp", "string", device.LastUpdateTimestamp);
        await this.UpdateHutData(device, new HutData_1.HutData());
        // const anelCom = new AnelHutCommunication(
        // 	device.DeviceIP,
        // 	Number(device.UDPRecievePort),
        // 	Number(device.UDPSendPort),
        // 	device.Username,
        // 	device.Password,
        // );
        // add link to communication
        device.HutCommunication = new AnelHutCommunication_1.AnelHutCommunication(device.DeviceIP, Number(device.UDPRecievePort), Number(device.UDPSendPort), device.Username, device.Password, this.log);
        device.HutCommunication.SubscribeStatusUpdates().subscribe((hutData) => {
            this.log.info("New hut status update: " + JSON.stringify(hutData));
            device.LastUpdateTimestamp = new Date().toLocaleString();
            this.UpdateHutData(device, hutData);
        });
    }
    /**
     *
     * @param parentDeviceName: Name of the parent device
     * @param variableName: Name of the variable
     * @param dataType: "boolean, string, number"
     * @param value: Current Value
     */
    async setDeviceProperties(parentDeviceName, variableName, dataType, value, role = "indicator") {
        await this.setObjectNotExistsAsync(parentDeviceName + "." + variableName, {
            type: "state",
            common: {
                name: variableName,
                type: dataType,
                role: role,
                read: true,
                write: true,
            },
            native: {},
        });
        this.setState(parentDeviceName + "." + variableName, value, true);
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        // Initialize your adapter here
        this.log.info("Adapter anelhut starting...");
        this.anelConfigDevices = this.config.getAnelDevices;
        if (this.anelConfigDevices == undefined) {
            this.log.error("No devices defined. Please edit configuration");
            return;
        }
        this.log.info("Found: " + this.anelConfigDevices.length + " devices in configuration");
        //filter disabled devices
        this.anelConfigDevices.forEach(async (d) => {
            this.log.info("Found device in config:  " + d.DeviceName + " | " + d.DeviceIP + " enabled: " + d.DeviceActive);
            if (d.DeviceActive) {
                await this.initializeDevice(d);
            }
        });
        this.log.info("Adapter anelhut initialized");
        //update adapter status
        this.setState("info.connection", true, true);
        /*
        For every state in the system there has to be also an object of type state
        Here a simple template for a boolean variable named "testVariable"
        Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
        */
        // await this.setObjectNotExistsAsync("testVariable", {
        // 	type: "state",
        // 	common: {
        // 		name: "testVariable",
        // 		type: "boolean",
        // 		role: "indicator",
        // 		read: true,
        // 		write: true,
        // 	},
        // 	native: {},
        // });
        // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
        // this.subscribeStates("testVariable");
        // You can also add a subscription for multiple states. The following line watches all states starting with "lights."
        // this.subscribeStates("lights.*");
        // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
        // this.subscribeStates("*");
        /*
            setState examples
            you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
        */
        // the variable testVariable is set to true as command (ack=false)
        // await this.setStateAsync("testVariable", true);
        // same thing, but the value is flagged "ack"
        // ack should be always set to true if the value is received from or acknowledged from the target system
        // await this.setStateAsync("testVariable", { val: true, ack: true });
        // // same thing, but the state is deleted after 30s (getState will return null afterwards)
        // await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });
        // examples for the checkPassword/checkGroup functions
        let result = await this.checkPasswordAsync("admin", "iobroker");
        this.log.info("check user admin pw iobroker: " + result);
        result = await this.checkGroupAsync("admin", "admin");
        this.log.info("check group user admin group admin: " + result);
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    onUnload(callback) {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout1);
            // clearTimeout(timeout2);
            // ...
            // clearInterval(interval1);
            callback();
        }
        catch (e) {
            callback();
        }
    }
    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  */
    // private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
    // 	if (obj) {
    // 		// The object was changed
    // 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    // 	} else {
    // 		// The object was deleted
    // 		this.log.info(`object ${id} deleted`);
    // 	}
    // }
    SendCommandToHut(id, state) {
        // anelhut.0.HUTOG.relais.4.Status
        const idParts = id.split(".");
        const hutName = idParts[2];
        const type = idParts[3];
        const relaisNumber = Number(idParts[4]);
        const status = idParts[5];
        if (type == "relais" && status == "Status") {
            this.anelConfigDevices.forEach((device) => {
                if (device.DeviceName == hutName && device.DeviceActive) {
                    device.HutCommunication.Switch(relaisNumber, state, false);
                }
            });
        }
    }
    /**
     * Is called if a subscribed state changes
     */
    onStateChange(id, state) {
        // we have to find the hut device based on the id here!
        if (state) {
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
            if (!state.ack) {
                // user changed value -> react with action
                this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})` + "-> changed by user");
                this.SendCommandToHut(id, Number(state.val));
            }
        }
        else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }
}
if (module.parent) {
    // Export the constructor in compact mode
    module.exports = (options) => new Anelhut(options);
}
else {
    // otherwise start the instance directly
    (() => new Anelhut())();
}
