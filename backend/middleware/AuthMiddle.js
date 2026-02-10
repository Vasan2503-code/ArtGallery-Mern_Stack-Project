const jwt = require('jsonwebtoken')
const multer = require('multer');
const path = require('path');
const { storage } = require('../config/CloudConfig');

const jwtsecret = process.env.JWTSecret

const middleWare = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).send({ message: "unAuthorized" });
  }
  const tokenValue = token.split(' ')[1];

  jwt.verify(tokenValue, jwtsecret, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    req.user = user;
    next();
  })
}

const upload = multer({ storage: storage });

module.exports = { middleWare, upload };
