"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Likes = void 0;
const mongoose_1 = require("mongoose");
//structura likes
const postSchema = new mongoose_1.Schema({
    idPost: {
        type: String
    },
    idUsuario: {
        type: String
    }
});
exports.Likes = (0, mongoose_1.model)('Likes', postSchema);
