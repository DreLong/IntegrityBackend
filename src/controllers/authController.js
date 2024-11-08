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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const jwtSecret = process.env.JWT_SECRET || '';
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, firstName, lastName, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        res.status(400).json({ message: 'Passwords do not match' });
        return;
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    try {
        const newUser = yield db_1.default.query(`INSERT INTO users (phoneNumber, firstName, lastName, email, password)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`, [phoneNumber, firstName, lastName, email, hashedPassword]);
        res.status(201).json(newUser.rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = req.body;
    try {
        const user = yield db_1.default.query(`SELECT * FROM users WHERE phoneNumber = $1`, [phoneNumber]);
        if (user.rowCount === 0 || !(yield bcryptjs_1.default.compare(password, user.rows[0].password))) {
            res.status(400).json({ message: 'Invalid phone number or password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.rows[0].id }, jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});
exports.login = login;
