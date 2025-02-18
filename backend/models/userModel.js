const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validate = require("validator");

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    usersPosts: [{ type: ObjectId, ref: "Post" }],
    followers: [{ type: ObjectId, ref: "User" }],
    followings: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

UserSchema.statics.signup = async function (email, username, name, password) {
  if (!email || !username || !name || !password) {
    throw Error("All fileds must be filled");
  }

  if (!validate.isEmail(email)) {
    throw Error("Not valid email format");
  }

  const emailExist = await this.findOne({ email });

  if (emailExist) {
    throw Error("This email is already in use");
  }

  const usernameExist = await this.findOne({ username });

  if (usernameExist) {
    throw Error("This username is already in use");
  }

  if (!validate.isStrongPassword(password)) {
    throw Error(
      "Password not strong enough - min 8 characters,required  one big letter and special character"
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, username, name, password: hash });

  return user;
};

UserSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw Error("All fileds must be filled");
  }

  const user = await this.findOne({ username });

  if (!user) {
    throw Error("Incorrect username");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", UserSchema);
