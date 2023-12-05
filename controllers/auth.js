const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const crypto = require("node:crypto");

const { HttpError, ctrlWrapper, sendEmail } = require("../helpers/");

const { SECRET_KEY, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use!");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  // створюємо тимчасову аватарку
  const avatarURL = gravatar.url(email, { s: "250" });
  const verificationToken = crypto.randomUUID();

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong!");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found!");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    message: "Verification successful!",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "Email not found!");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed!");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email via link",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify your email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Verification email sent!",
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription, token } = req.user;

  res.status(200).json({
    user: { email, subscription },
    // email,
    // subscription,
    token,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).end();
  //   щоб повідомлення було, краще писати 200
  //   res.status(200).json({
  //     message: "Logout success!",
  //   });
};

const subscription = async (req, res) => {
  const { contactId } = req.params;
  const { subscription } = req.body;

  const result = await User.findByIdAndUpdate(
    contactId,
    { subscription },
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(404, "Not found!");
  }
  res.status(200).json(result);
};

const updateAvatar = async (req, res) => {
  const avatarsDir = path.join(__dirname, "../", "public", "avatars");
  const { _id } = req.user;

  if (!req.file) {
    throw HttpError(404, "Not found!");
  }

  const resize = async fileDir => {
    const image = await Jimp.read(fileDir);
    image
      .resize(250, Jimp.AUTO)
      .cover(250, 250, Jimp.VERTICAL_ALIGN_MIDDLE)
      .write(fileDir);
  };

  // змінюємо назву файлу на унікальну (додаючи просто id користувача)
  // const { path: tempURL, originalname } = req.file;
  // const filename = `${_id}_${originalname}`;
  // const resultURL = path.join(avatarsDir, filename);
  // await fs.rename(tempURL, resultURL);
  // const avatarURL = path.join("avatars", filename);

  // так як ми змінили назву раніше, то залишаємо її
  const { path: tempURL, filename } = req.file;

  await resize(tempURL);
  const resultURL = path.join(avatarsDir, filename);

  await fs.rename(tempURL, resultURL);
  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(
    _id,
    { avatarURL, avatarImage: filename },
    { new: true }
  ).exec();

  res.status(200).json({
    avatarURL,
  });
};

const getAvatar = async (req, res) => {
  console.log(req.user);
  // res.end();
  const user = await User.findById(req.user._id).exec();
  if (user === null) {
    return res.status(404).send({ message: "User not found" });
  }

  if (!user.avatarURL) {
    return res.status(404).send({ message: "Avatar not found" });
  }

  res.sendFile(path.join(__dirname, "..", "public/", user.avatarURL));
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  subscription: ctrlWrapper(subscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  getAvatar: ctrlWrapper(getAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
