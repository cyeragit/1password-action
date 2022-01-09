"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.install = void 0;
var os = require("os");
var core = require("@actions/core");
var io_1 = require("@actions/io");
var io_util_1 = require("@actions/io/lib/io-util");
var tc = require("@actions/tool-cache");
var exec = require("@actions/exec");
var exec_1 = require("./exec");
var fs_1 = require("fs");
var CERT_IDENTIFIER = 'Developer ID Installer: AgileBits Inc. (2BUA8C4S2C)';
var KEY_FINGERPRINT = '3FEF9748469ADBE15DA7CA80AC2D62742012EA22';
function install(onePasswordVersion) {
    return __awaiter(this, void 0, void 0, function () {
        var platform, extension, onePasswordUrl, archive, extracted, signatureCheck, destination_1, verifyStatus, destination, cachedPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    platform = os.platform().toLowerCase();
                    extension = 'zip';
                    if (platform === 'darwin') {
                        extension = 'pkg';
                    }
                    onePasswordUrl = "https://cache.agilebits.com/dist/1P/op/pkg/v" + onePasswordVersion + "/op_" + platform + "_amd64_v" + onePasswordVersion + "." + extension;
                    return [4 /*yield*/, tc.downloadTool(onePasswordUrl)];
                case 1:
                    archive = _a.sent();
                    if (!(platform === 'darwin')) return [3 /*break*/, 5];
                    return [4 /*yield*/, exec_1.execWithOutput('pkgutil', [
                            '--check-signature',
                            archive
                        ])];
                case 2:
                    signatureCheck = _a.sent();
                    if (signatureCheck.includes(CERT_IDENTIFIER) === false) {
                        throw new Error("Signature verification of the installer package downloaded from " + onePasswordUrl + " failed.\nExpecting it to include " + CERT_IDENTIFIER + ".\nReceived:\n" + signatureCheck);
                    }
                    else {
                        core.info('Verified the code signature of the installer package.');
                    }
                    destination_1 = 'op.unpkg';
                    return [4 /*yield*/, exec.exec('pkgutil', ['--expand', archive, destination_1])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, exec.exec("/bin/bash -c \"cat " + destination_1 + "/Payload | gzip -d | cpio -id\"")];
                case 4:
                    _a.sent();
                    extracted = '.';
                    return [3 /*break*/, 9];
                case 5: return [4 /*yield*/, tc.extractZip(archive)];
                case 6:
                    extracted = _a.sent();
                    return [4 /*yield*/, exec.exec('gpg', [
                            '--keyserver',
                            'keyserver.ubuntu.com',
                            '--receive-keys',
                            KEY_FINGERPRINT
                        ])];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, exec.exec('gpg', [
                            '--verify',
                            extracted + "/op.sig",
                            extracted + "/op"
                        ])];
                case 8:
                    verifyStatus = _a.sent();
                    if (verifyStatus !== 0) {
                        throw new Error("Signature verification of the executable downloaded from " + onePasswordUrl + " failed.");
                    }
                    _a.label = 9;
                case 9:
                    destination = process.env.HOME + "/bin";
                    // Using ACT, lets set to a directory we have access to.
                    if (process.env.ACT) {
                        destination = "/tmp";
                    }
                    return [4 /*yield*/, io_1.mv(extracted + "/op", destination + "/op")];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, io_util_1.chmod(destination + "/op", '0755')];
                case 11:
                    _a.sent();
                    fs_1.mkdir('~/.config/op', function () { });
                    return [4 /*yield*/, tc.cacheDir(destination, 'op', onePasswordVersion)];
                case 12:
                    cachedPath = _a.sent();
                    core.addPath(cachedPath);
                    return [2 /*return*/];
            }
        });
    });
}
exports.install = install;
