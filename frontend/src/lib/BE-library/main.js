"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
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
exports.DashboardOperation = exports.ProfileOperation = exports.CourseOperation = exports.UserOperation = exports.AuthOperation = void 0;
var axios_1 = require("axios");
/*
  HƯỚNG DẪN LẮP API (DEV / INTEGRATION)

  1) Tải tsc và tạo file env cho NEXT_PUBLIC_IDENTITY_API_BASE_URL
  2) Viết code theo mẫu trong class AuthOperation bên dưới
  4) Viết type cho payload request và response trong file interfaces.ts
  5) Chạy lệnh:
    cd frontend/src/lib/BE-library
    tsc main.ts
  6) Import và sử dụng class đã viết trong codebase frontend (tham khảo file signup/page.tsx)
*/
var BASE_URL = "http://localhost:8181/api/v1";
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
var CourseOperation = /** @class */ (function () {
    function CourseOperation() {
        this.baseUrl = BASE_URL;
    }
    CourseOperation.prototype.getAllCourses = function (pageable, semester, enrollmentStatus) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_9;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/courses"), {
                            params: __assign(__assign({}, pageable), { semester: semester, enrollmentStatus: enrollmentStatus }),
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_9 = _d.sent();
                        console.error("Error fetching all courses: ", (_a = error_9 === null || error_9 === void 0 ? void 0 : error_9.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_9 === null || error_9 === void 0 ? void 0 : error_9.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CourseOperation.prototype.createCourse = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_10;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl, "/courses"), payload, {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_10 = _d.sent();
                        console.error("Error creating course: ", (_a = error_10 === null || error_10 === void 0 ? void 0 : error_10.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_10 === null || error_10 === void 0 ? void 0 : error_10.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CourseOperation.prototype.getCourseById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_11;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/courses/").concat(id), {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_11 = _d.sent();
                        console.error("Error fetching course by id: ", (_a = error_11 === null || error_11 === void 0 ? void 0 : error_11.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_11 === null || error_11 === void 0 ? void 0 : error_11.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CourseOperation.prototype.getMyCourses = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_12;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/courses/my-courses"), {
                            params: { status: status },
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_12 = _d.sent();
                        console.error("Error fetching my courses: ", (_a = error_12 === null || error_12 === void 0 ? void 0 : error_12.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_12 === null || error_12 === void 0 ? void 0 : error_12.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return CourseOperation;
}());
exports.CourseOperation = CourseOperation;
var ProfileOperation = /** @class */ (function () {
    function ProfileOperation() {
        this.baseUrl = BASE_URL; // BASE_URL = http://localhost:8080/api/v1
    }
    // ==========================================
    // USER PROFILE CONTROLLER
    // ==========================================
    ProfileOperation.prototype.getMyProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_13;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/profile/me"), {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_13 = _e.sent();
                        console.error("Error fetching user profile: ", (_a = error_13 === null || error_13 === void 0 ? void 0 : error_13.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_13 === null || error_13 === void 0 ? void 0 : error_13.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_13 === null || error_13 === void 0 ? void 0 : error_13.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProfileOperation.prototype.updateMyProfile = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_14;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.put("".concat(this.baseUrl, "/profile/me"), payload, {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_14 = _e.sent();
                        console.error("Error updating user profile: ", (_a = error_14 === null || error_14 === void 0 ? void 0 : error_14.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_14 === null || error_14 === void 0 ? void 0 : error_14.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_14 === null || error_14 === void 0 ? void 0 : error_14.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProfileOperation.prototype.getProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_15;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/profile/").concat(userId), {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_15 = _e.sent();
                        console.error("Error fetching user profile by ID: ", (_a = error_15 === null || error_15 === void 0 ? void 0 : error_15.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_15 === null || error_15 === void 0 ? void 0 : error_15.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_15 === null || error_15 === void 0 ? void 0 : error_15.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProfileOperation.prototype.getProfiles = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_16;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/profile/users"), {
                            params: { ids: ids },
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_16 = _e.sent();
                        console.error("Error fetching user profiles by IDs: ", (_a = error_16 === null || error_16 === void 0 ? void 0 : error_16.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_16 === null || error_16 === void 0 ? void 0 : error_16.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_16 === null || error_16 === void 0 ? void 0 : error_16.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================
    // SKILL CONTROLLER
    // ==========================================
    ProfileOperation.prototype.getMySkills = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_17;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/profile/skills"), {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_17 = _e.sent();
                        console.error("Error fetching user skills: ", (_a = error_17 === null || error_17 === void 0 ? void 0 : error_17.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_17 === null || error_17 === void 0 ? void 0 : error_17.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_17 === null || error_17 === void 0 ? void 0 : error_17.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProfileOperation.prototype.addSkill = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_18;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl, "/profile/skills"), payload, {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_18 = _e.sent();
                        console.error("Error adding skill: ", (_a = error_18 === null || error_18 === void 0 ? void 0 : error_18.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_18 === null || error_18 === void 0 ? void 0 : error_18.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_18 === null || error_18 === void 0 ? void 0 : error_18.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProfileOperation.prototype.updateSkill = function (skillId, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_19;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.put("".concat(this.baseUrl, "/profile/skills/").concat(skillId), payload, {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_19 = _e.sent();
                        console.error("Error updating skill: ", (_a = error_19 === null || error_19 === void 0 ? void 0 : error_19.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_19 === null || error_19 === void 0 ? void 0 : error_19.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_19 === null || error_19 === void 0 ? void 0 : error_19.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProfileOperation.prototype.deleteSkill = function (skillId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_20;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.delete("".concat(this.baseUrl, "/profile/skills/").concat(skillId), {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_20 = _e.sent();
                        console.error("Error deleting skill: ", (_a = error_20 === null || error_20 === void 0 ? void 0 : error_20.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_20 === null || error_20 === void 0 ? void 0 : error_20.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_20 === null || error_20 === void 0 ? void 0 : error_20.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProfileOperation.prototype.getUserSkills = function (userId, category) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_21;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/profile/").concat(userId, "/skills"), {
                            params: { category: category },
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_21 = _e.sent();
                        console.error("Error fetching user skills by ID: ", (_a = error_21 === null || error_21 === void 0 ? void 0 : error_21.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_21 === null || error_21 === void 0 ? void 0 : error_21.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_21 === null || error_21 === void 0 ? void 0 : error_21.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================
    // SCHEDULE CONTROLLER
    // ==========================================
    ProfileOperation.prototype.getMySchedule = function (from, to) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_22;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/schedules"), {
                            params: { from: from, to: to },
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_22 = _e.sent();
                        console.error("Error fetching schedule: ", (_a = error_22 === null || error_22 === void 0 ? void 0 : error_22.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_22 === null || error_22 === void 0 ? void 0 : error_22.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_22 === null || error_22 === void 0 ? void 0 : error_22.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProfileOperation.prototype.createSlot = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_23;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl, "/schedules"), payload, {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_23 = _e.sent();
                        console.error("Error creating schedule slot: ", (_a = error_23 === null || error_23 === void 0 ? void 0 : error_23.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_23 === null || error_23 === void 0 ? void 0 : error_23.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_23 === null || error_23 === void 0 ? void 0 : error_23.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProfileOperation.prototype.deleteSlot = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_24;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.delete("".concat(this.baseUrl, "/schedules/").concat(id), {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_24 = _e.sent();
                        console.error("Error deleting schedule slot: ", (_a = error_24 === null || error_24 === void 0 ? void 0 : error_24.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_24 === null || error_24 === void 0 ? void 0 : error_24.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_24 === null || error_24 === void 0 ? void 0 : error_24.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================
    // GROUP CONTROLLER
    // ==========================================
    ProfileOperation.prototype.getMyGroups = function (role) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_25;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/groups"), {
                            params: { role: role },
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_25 = _e.sent();
                        console.error("Error fetching user groups: ", (_a = error_25 === null || error_25 === void 0 ? void 0 : error_25.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_25 === null || error_25 === void 0 ? void 0 : error_25.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_25 === null || error_25 === void 0 ? void 0 : error_25.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProfileOperation.prototype.createGroup = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_26;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl, "/groups"), payload, {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_26 = _e.sent();
                        console.error("Error creating group: ", (_a = error_26 === null || error_26 === void 0 ? void 0 : error_26.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_26 === null || error_26 === void 0 ? void 0 : error_26.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_26 === null || error_26 === void 0 ? void 0 : error_26.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProfileOperation.prototype.joinGroup = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_27;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl, "/groups/join"), payload, {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_27 = _e.sent();
                        console.error("Error joining group: ", (_a = error_27 === null || error_27 === void 0 ? void 0 : error_27.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_27 === null || error_27 === void 0 ? void 0 : error_27.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_27 === null || error_27 === void 0 ? void 0 : error_27.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProfileOperation.prototype.getGroupMembers = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_28;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/groups/").concat(id, "/members"), {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_28 = _e.sent();
                        console.error("Error fetching group members: ", (_a = error_28 === null || error_28 === void 0 ? void 0 : error_28.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_28 === null || error_28 === void 0 ? void 0 : error_28.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_28 === null || error_28 === void 0 ? void 0 : error_28.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProfileOperation.prototype.promoteMember = function (id, userId, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_29;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.put("".concat(this.baseUrl, "/groups/").concat(id, "/members/").concat(userId, "/role"), payload, {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_29 = _e.sent();
                        console.error("Error promoting member: ", (_a = error_29 === null || error_29 === void 0 ? void 0 : error_29.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_29 === null || error_29 === void 0 ? void 0 : error_29.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_29 === null || error_29 === void 0 ? void 0 : error_29.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProfileOperation.prototype.removeMember = function (id, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_30;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.delete("".concat(this.baseUrl, "/groups/").concat(id, "/members/").concat(userId), {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_30 = _e.sent();
                        console.error("Error removing member: ", (_a = error_30 === null || error_30 === void 0 ? void 0 : error_30.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_30 === null || error_30 === void 0 ? void 0 : error_30.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_30 === null || error_30 === void 0 ? void 0 : error_30.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ProfileOperation;
}());
exports.ProfileOperation = ProfileOperation;
var DashboardOperation = /** @class */ (function () {
    function DashboardOperation() {
        this.baseUrl = BASE_URL + "/dashboard";
    }
    DashboardOperation.prototype.getStudentDashboard = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_31;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/student"), {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_31 = _e.sent();
                        console.error("Error fetching student dashboard: ", (_a = error_31 === null || error_31 === void 0 ? void 0 : error_31.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_31 === null || error_31 === void 0 ? void 0 : error_31.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_31 === null || error_31 === void 0 ? void 0 : error_31.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DashboardOperation.prototype.getStudentSummary = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_32;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/student/summary"), {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_32 = _e.sent();
                        console.error("Error fetching student summary: ", (_a = error_32 === null || error_32 === void 0 ? void 0 : error_32.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_32 === null || error_32 === void 0 ? void 0 : error_32.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_32 === null || error_32 === void 0 ? void 0 : error_32.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DashboardOperation.prototype.getStudentAnalytics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_33;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/student/analytics"), {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_33 = _e.sent();
                        console.error("Error fetching student analytics: ", (_a = error_33 === null || error_33 === void 0 ? void 0 : error_33.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_33 === null || error_33 === void 0 ? void 0 : error_33.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_33 === null || error_33 === void 0 ? void 0 : error_33.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================
    // INSTRUCTOR DASHBOARD CONTROLLER
    // ==========================================
    DashboardOperation.prototype.getInstructorCourseStats = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_34;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/instructor/courses/").concat(id), {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_34 = _e.sent();
                        console.error("Error fetching instructor course stats: ", (_a = error_34 === null || error_34 === void 0 ? void 0 : error_34.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_34 === null || error_34 === void 0 ? void 0 : error_34.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_34 === null || error_34 === void 0 ? void 0 : error_34.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DashboardOperation.prototype.getAtRiskStudents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_35;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/instructor/at-risk"), {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_35 = _e.sent();
                        console.error("Error fetching at-risk students list: ", (_a = error_35 === null || error_35 === void 0 ? void 0 : error_35.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_35 === null || error_35 === void 0 ? void 0 : error_35.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_35 === null || error_35 === void 0 ? void 0 : error_35.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================
    // ADMIN DASHBOARD CONTROLLER
    // ==========================================
    DashboardOperation.prototype.getAdminStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_36;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/admin/stats"), {
                            withCredentials: true,
                            validateStatus: function (status) { return status >= 200 && status < 300; },
                        })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_36 = _e.sent();
                        console.error("Error fetching admin stats: ", (_a = error_36 === null || error_36 === void 0 ? void 0 : error_36.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: ((_c = (_b = error_36 === null || error_36 === void 0 ? void 0 : error_36.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "An error occurred",
                            data: null,
                            status: ((_d = error_36 === null || error_36 === void 0 ? void 0 : error_36.response) === null || _d === void 0 ? void 0 : _d.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================
    // HEALTH CHECK (ROOT)
    // ==========================================
    DashboardOperation.prototype.healthCheck = function () {
        return __awaiter(this, void 0, void 0, function () {
            var healthUrl, response, error_37;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        healthUrl = BASE_URL.replace('/api/v1', '') + '/health';
                        return [4 /*yield*/, axios_1.default.get(healthUrl, {
                            validateStatus: function (status) { return status >= 200 && status < 600; }, // Chấp nhận cả lỗi 5xx
                        })];
                    case 1:
                        response = _c.sent();
                        return [2 /*return*/, unwrap(response)];
                    case 2:
                        error_37 = _c.sent();
                        console.error("Error performing health check: ", (_a = error_37 === null || error_37 === void 0 ? void 0 : error_37.response) === null || _a === void 0 ? void 0 : _a.data);
                        return [2 /*return*/, {
                            success: false,
                            message: "Failed to connect to health endpoint",
                            data: null,
                            status: ((_b = error_37 === null || error_37 === void 0 ? void 0 : error_37.response) === null || _b === void 0 ? void 0 : _b.status) || 500,
                        }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return DashboardOperation;
}());
exports.DashboardOperation = DashboardOperation;
