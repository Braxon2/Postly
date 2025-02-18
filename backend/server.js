require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");

const userRouter = require("./routes/userRoute");
const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/comment/", commentRouter);

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Connected to db and listening to port ${process.env.PORT}`);
  });
});
