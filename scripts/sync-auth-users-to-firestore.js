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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var admin = require("firebase-admin");
var firestore_1 = require("firebase-admin/firestore");
// Path to your service account key JSON file
var serviceAccount = require('../serviceAccountKey.json');
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
var db = (0, firestore_1.getFirestore)();
var auth = admin.auth();
function syncUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var nextPageToken, createdCount, skippedCount, listUsersResult, _i, _a, userRecord, userId, userDocRef, userDoc;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    createdCount = 0;
                    skippedCount = 0;
                    _b.label = 1;
                case 1: return [4 /*yield*/, auth.listUsers(1000, nextPageToken)];
                case 2:
                    listUsersResult = _b.sent();
                    _i = 0, _a = listUsersResult.users;
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    userRecord = _a[_i];
                    userId = userRecord.uid;
                    userDocRef = db.collection('users').doc(userId);
                    return [4 /*yield*/, userDocRef.get()];
                case 4:
                    userDoc = _b.sent();
                    if (!!userDoc.exists) return [3 /*break*/, 6];
                    return [4 /*yield*/, userDocRef.set({
                            id: userId,
                            email: userRecord.email || '',
                            name: userRecord.displayName || '',
                            image: userRecord.photoURL || '',
                            role: 'user',
                            createdAt: new Date(),
                            profileCompleted: false,
                        })];
                case 5:
                    _b.sent();
                    console.log("Created Firestore doc for user: ".concat(userId));
                    createdCount++;
                    return [3 /*break*/, 7];
                case 6:
                    skippedCount++;
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8:
                    nextPageToken = listUsersResult.pageToken;
                    _b.label = 9;
                case 9:
                    if (nextPageToken) return [3 /*break*/, 1];
                    _b.label = 10;
                case 10:
                    console.log("Sync complete. Created: ".concat(createdCount, ", Skipped (already existed): ").concat(skippedCount));
                    return [2 /*return*/];
            }
        });
    });
}
syncUsers().catch(function (err) {
    console.error('Error syncing users:', err);
    process.exit(1);
});
