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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOperation = exports.AuthOperation = void 0;
var axios_1 = require("axios");
/*
  HƯỚNG DẪN LẮP API (DEV / INTEGRATION)

  1) Tải tsc và tạo file env cho NEXT_PUBLIC_IDENTITY_API_BASE_URL
  2) Viết code theo mẫu trong class AuthOperation bên dưới
  4) Viết type cho payload request và response trong file interfaces.ts
  5) Chạy lệnh: tsc frontend/src/lib/BE-library/main.ts
  6) Import và sử dụng class đã viết trong codebase frontend (tham khảo file signup/page.tsx)
*/
var BASE_URL = "http://localhost:8080/api/v1";
var unwrap = function (response) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return ({
        success: (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.success) !== null && _b !== void 0 ? _b : (response.status >= 200 && response.status < 300),
        message: (_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : "Success",
        data: (_h = (_f = (_e = response.data) === null || _e === void 0 ? void 0 : _e.body) !== null && _f !== void 0 ? _f : (_g = response.data) === null || _g === void 0 ? void 0 : _g.data) !== null && _h !== void 0 ? _h : response.data,
        status: response.status,
    });
};
var AuthOperation = /** @class */ (function () {
    function AuthOperation() {
        this.baseUrl = BASE_URL + "/auth";
    }
    AuthOperation.prototype.signup = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl, "/register"), payload, {
                                withCredentials: true,
                                validateStatus: function (status) { return status >= 200 && status < 300; },
                            })];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_1 = _d.sent();
                        console.error("Error signing up: ", (_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                                success: false,
                                message: ((_c = (_b = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthOperation.prototype.signin = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl, "/login"), payload, {
                                withCredentials: true,
                                validateStatus: function (status) { return status >= 200 && status < 300; },
                            })];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_2 = _d.sent();
                        console.error("Error signing in: ", (_a = error_2 === null || error_2 === void 0 ? void 0 : error_2.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                                success: false,
                                message: ((_c = (_b = error_2 === null || error_2 === void 0 ? void 0 : error_2.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthOperation.prototype.refreshToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl, "/refresh"), { refreshToken: refreshToken }, {
                                withCredentials: true,
                                validateStatus: function (status) { return status >= 200 && status < 300; },
                            })];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_3 = _d.sent();
                        console.error("Error refreshing token: ", (_a = error_3 === null || error_3 === void 0 ? void 0 : error_3.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                                success: false,
                                message: ((_c = (_b = error_3 === null || error_3 === void 0 ? void 0 : error_3.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthOperation.prototype.logout = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl, "/logout"), refreshToken ? { refreshToken: refreshToken } : {}, {
                                withCredentials: true,
                                validateStatus: function (status) { return status >= 200 && status < 300; },
                            })];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_4 = _d.sent();
                        console.error("Error logging out: ", (_a = error_4 === null || error_4 === void 0 ? void 0 : error_4.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                                success: false,
                                message: ((_c = (_b = error_4 === null || error_4 === void 0 ? void 0 : error_4.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthOperation.prototype.resetPassword = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_5;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl, "/reset-password"), payload, {
                                withCredentials: true,
                                validateStatus: function (status) { return status >= 200 && status < 300; },
                            })];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_5 = _d.sent();
                        console.error("Error resetting password: ", (_a = error_5 === null || error_5 === void 0 ? void 0 : error_5.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                                success: false,
                                message: ((_c = (_b = error_5 === null || error_5 === void 0 ? void 0 : error_5.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthOperation.prototype.listSessions = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_6;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/sessions/").concat(username), {
                                withCredentials: true,
                                validateStatus: function (status) { return status >= 200 && status < 300; },
                            })];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_6 = _d.sent();
                        console.error("Error fetching sessions: ", (_a = error_6 === null || error_6 === void 0 ? void 0 : error_6.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                                success: false,
                                message: ((_c = (_b = error_6 === null || error_6 === void 0 ? void 0 : error_6.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthOperation.prototype.revokeSession = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_7;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.delete("".concat(this.baseUrl, "/sessions/").concat(id), {
                                withCredentials: true,
                                validateStatus: function (status) { return status >= 200 && status < 300; },
                            })];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_7 = _d.sent();
                        console.error("Error revoking session: ", (_a = error_7 === null || error_7 === void 0 ? void 0 : error_7.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                                success: false,
                                message: ((_c = (_b = error_7 === null || error_7 === void 0 ? void 0 : error_7.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AuthOperation;
}());
exports.AuthOperation = AuthOperation;
var UserOperation = /** @class */ (function () {
    function UserOperation() {
        this.baseUrl = BASE_URL + "/user";
    }
    UserOperation.prototype.getAuthenticatedInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_8;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/me"), {
                                withCredentials: true,
                                validateStatus: function (status) { return status >= 200 && status < 300; },
                            })];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_8 = _d.sent();
                        console.error("Error fetching authenticated user info: ", (_a = error_8 === null || error_8 === void 0 ? void 0 : error_8.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                                success: false,
                                message: ((_c = (_b = error_8 === null || error_8 === void 0 ? void 0 : error_8.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserOperation;
}());
exports.UserOperation = UserOperation;
