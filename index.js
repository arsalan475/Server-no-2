const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please also submit email"],
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  classes: {
    type: String,
    required: true,
  },
});

const Users = mongoose.model("Users", messageSchema);
const Course = mongoose.model("Course", courseSchema);

app.get("/courses", async (req, res) => {
  try {
    const courseData = await Course.find();
    res.status(200).json({ cData: courseData });
  } catch (e) {
    res.status(500).res.json({ msg: e.message });
  }
});

app.post("/courses", async (req, res) => {
  const { name, classes } = req.body;
  try {
    const data = await Course.create({ name, classes });
    res.status(200).json({ cData: data });
  } catch (e) {
    res.status(500).res.json({ msg: e.message });
  }
});

app.delete("/courses/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const courseMatched = await Course.findById(id);
    if (!courseMatched) {
      return res.status(404).res.json({ msg: "not found" });
    }

    await Course.findByIdAndDelete(id);
    res.status(200).json({ msg: "successfully Deleted" });
  } catch (e) {
    res.status(500).res.json({ msg: e.message });
  }
});

app.get("/users", async function (req, res) {
  try {
    const users = await Users.find();
    res.status(200).json({ data: users });
  } catch (e) {
    res.status(404).json({ msg: e.message });
  }
});

app.post("/users", async (req, res) => {
  const { name, email, age } = req.body;
  await Users.create({ name, email, age });

  res.send({ success: "true" });
});

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const isUser = await Users.findById(id);
    if (!isUser) {
    }
    await Users.findByIdAndDelete(id);
    res.send({ msg: "Deleted successfull" });
  } catch (e) {
    res.send({ msg: e.message });
  }
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const isUser = await Users.findById(id);
    if (!isUser) {
      return res.status(404).json({ msg: "user not found" });
    }

    const updated = await Users.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ msg: "suceesfully updated" });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const onlyStudent = await Users.findById(id);
    res.status(200).json({ student: onlyStudent });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// connect dateBase with mongoose with promisses

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("database connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server is runing on ${process.env.PORT}`);
    });
  })
  .catch((err) => err.message);
