const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers");
const User = require("../models/user");

const { SECRET_KEY } = process.env;
const authenticate = async (req, res, next) => {
  // Якщо не буде нічого в headers authorization, то прийде undefined, тоді split поламає бекенд, тому найпростіше поставити дефолтне значення ""
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  // перевірка на наявність Bearer в headers.authorization
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized!"));
  }
  // перевірка на валідність токену
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorized! User not found!"));
    }

    // можна записати в req, хто робить цей запит, щоб потім використати це в controllers
    req.user = user;
    next();
  } catch {
    next(HttpError(401, "Not authorized!"));
  }
};

module.exports = authenticate;
