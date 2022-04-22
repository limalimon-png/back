"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const likes_model_1 = require("../modelos/likes.model");
const likesRoutes = (0, express_1.Router)();
//like post
likesRoutes.post('/like', (req, res) => {
    const likesito = {
        idUsuario: req.body.idUsuario,
        idPost: req.body.idPost,
    };
    likes_model_1.Likes.create(likesito).then(userDB => {
        res.json({
            ok: true,
            like: userDB,
        });
    });
});
//unlike post
likesRoutes.post('/unlike', (req, res) => {
    const likesito = {
        idUsuario: req.body.idUsuario,
        idPost: req.body.idPost,
    };
    likes_model_1.Likes.deleteOne(likesito).then(userDB => {
        res.json({
            ok: true,
            // like:userDB,
        });
    });
});
exports.default = likesRoutes;
