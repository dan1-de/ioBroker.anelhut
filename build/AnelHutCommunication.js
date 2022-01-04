"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnelHutCommunication = void 0;
const rxjs_1 = require("rxjs");
const HutData_1 = require("./HutData");
const dgram = require("dgram");
class AnelHutCommunication {
    constructor(hostIpAdress, udpRecievePort, udpSendPort, user, password, logger) {
        this.HutStatusObservable = new rxjs_1.Subject();
        this.socket = dgram.createSocket("udp4");
        this.hostIpAdress = hostIpAdress;
        this.user = user;
        this.password = password;
        this.udpRecievePort = udpRecievePort;
        this.udpSendPort = udpSendPort;
        this.logger = logger;
        try {
            this.socket.bind(udpRecievePort);
        }
        catch (e) {
            this.logger.error("Error binding to socket: " + e);
            return;
        }
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
    CloseSocket() {
        try {
            this.socket.close();
        }
        catch (e) { }
    }
    static keyCharAt(key, i) {
        return key.charCodeAt(Math.floor(i % key.length));
    }
    static xor_encrypt(key, data) {
        return Array.prototype.map.call(data, (c, i) => {
            return c.charCodeAt(0) ^ this.keyCharAt(key, i);
        });
    }
    static EncryptUserPassword(data, key) {
        data = this.xor_encrypt(key, data);
        return this.b64_encode(data);
    }
    static b64_encode(data) {
        let o1, o2, o3, h1, h2, h3, h4, bits, i = 0, enc = "";
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
    SwitchIo(ioNumber, newState, encrypt = false) {
        let command = "";
        if (newState == 0) {
            command = "IO_off" + ioNumber;
        }
        else if (newState == 1) {
            command = "IO_on" + ioNumber;
        }
        else {
            console.log("Invalid command");
            return;
        }
        this.Switch(command, encrypt);
    }
    SwitchRelais(relaisNumber, newState, encrypt = false) {
        let command = "";
        if (newState == 0) {
            command = "Sw_off" + relaisNumber;
        }
        else if (newState == 1) {
            command = "Sw_on" + relaisNumber;
        }
        else {
            console.log("Invalid command");
            return;
        }
        this.Switch(command, encrypt);
    }
    //encryption is currently not working -> encrypt boolean is currently ignored
    Switch(command, encrypt) {
        encrypt = false; // ignore encryption -> fix this in next versions
        const user_password = this.user + this.password;
        const encr_user_password = AnelHutCommunication.EncryptUserPassword(user_password, this.password) + "\0";
        console.log("EncrPasswd: " + encr_user_password);
        let bef;
        if (encrypt) {
            bef = command + encr_user_password; //for example: Sw_on1ASfdhhgfDS
        }
        else {
            bef = command + user_password; //for example: Sw_on1adminanel
        }
        const client = dgram.createSocket("udp4");
        client.send(bef, this.udpSendPort, this.hostIpAdress, (err) => {
            this.logger.error("Error while sending command to hut: " + err);
            client.close();
        });
    }
    SubscribeStatusUpdates() {
        return this.HutStatusObservable;
    }
    static ConvertMacNumbersToHexString(mac) {
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
            }
            else {
                result += hexValue + ":";
            }
            i++;
        });
        return result;
    }
    GetRelaisList(messageParts, relaisCount) {
        const RelaisList = new Array();
        for (let i = 0; i < relaisCount; i++) {
            const name_split = messageParts[6 + i].split(",");
            RelaisList.push(new HutData_1.Relais(i + 1, name_split[0], Number(name_split[1])));
        }
        return RelaisList;
    }
    DecodeMessage(message) {
        const hutData = new HutData_1.HutData();
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
        hutData.Relais = this.GetRelaisList(messageParts, 8);
        hutData.Blocked = Number(messageParts[14]);
        hutData.HttpPort = Number(messageParts[15]);
        hutData.Temperature = -127; // ??
        if (messageParts[16].startsWith("NET-PWRCTRL") == true) {
            hutData.Type = messageParts[17];
            hutData.XOR_USER_Password = false;
            if (messageParts[18] == "xor") {
                hutData.XOR_USER_Password = true;
            }
        }
        else {
            if (hutData.Blocked >= 248) {
                hutData.Type = "H";
            }
            else {
                hutData.Type = "P";
            }
        }
        // IO Part:
        if (messageParts.length > 20) {
            const IOList = new Array();
            //IO
            for (let i = 0; i < 8; i++) {
                const name_split = messageParts[16 + i].split(",");
                IOList.push(new HutData_1.IOState(i + 1, name_split[0], Number(name_split[1]), Number(name_split[2])));
            }
            hutData.IO = IOList;
            const temp = messageParts[24].substr(0, messageParts[24].length - 2);
            hutData.Temperature = Number(temp);
            hutData.Firmware = messageParts[25];
            //since FW 6.0
            if (messageParts.length > 26) {
                hutData.Type = messageParts[26];
                //--------------------------------------------------------------------------------
                //Typ { a = ADV; i = IO; h = HUT; o = ONE; f = ONE-F; H = Home; P = PRO}
                //--------------------------------------------------------------------------------
                //give type a name here:
                switch (hutData.Type) {
                    case "a":
                        hutData.Type = "ADV";
                        hutData.IO = new Array(); // no IO
                        break;
                    case "i":
                        hutData.Type = "IO";
                        break;
                    case "h":
                        hutData.Type = "HUT";
                        break;
                    case "o":
                        hutData.Type = "ONE";
                        hutData.IO = new Array(); // no IO
                        break;
                    case "f":
                        hutData.Type = "ONE-F";
                        hutData.IO = new Array(); // no IO
                        break;
                    case "H":
                        hutData.Type = "Home";
                        this.logger.info("HOME: initialize only 3 relais");
                        // home -> support only 3 relais -> initialize relais of home again
                        hutData.Relais = this.GetRelaisList(messageParts, 3);
                        hutData.IO = new Array(); // no IO
                        break;
                    case "P":
                        hutData.Type = "PRO";
                        hutData.IO = new Array(); // no IO
                        break;
                    default:
                        hutData.Type = "unknown";
                        break;
                }
                //Power
                hutData.PowerMeasurement = false;
                if (messageParts[27] == "p") {
                    const start = 28;
                    hutData.VoltageRMS = Number(messageParts[start]);
                    hutData.CurrentRMS = Number(messageParts[start + 1]);
                    hutData.LineFrequency = Number(messageParts[start + 2]);
                    hutData.ActivePower = Number(messageParts[start + 3]);
                    hutData.ApparentPower = Number(messageParts[start + 4]);
                    hutData.ReactivePower = Number(messageParts[start + 5]);
                    hutData.PowerFactor = Number(messageParts[start + 6]);
                    hutData.PowerMeasurement = true;
                }
                //Sensor 1
                hutData.Sensor_1_Ready = false;
                if (messageParts[messageParts.length - 6] == "s") {
                    hutData.Sensor_1_Ready = true;
                    hutData.Sensor_1_Temperature = Number(messageParts[messageParts.length - 5]);
                    hutData.Sensor_1_Humidity = Number(messageParts[messageParts.length - 4]);
                    hutData.Sensor_1_Brightness = Number(messageParts[messageParts.length - 3]);
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
exports.AnelHutCommunication = AnelHutCommunication;
AnelHutCommunication.b64_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
