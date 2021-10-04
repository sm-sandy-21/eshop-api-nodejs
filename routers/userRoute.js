const { User } = require("../Models/User");
const express = require("express");
const router = express.Router();
const mongose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

router.get(``, async (req, res) => {
  //Select only name email phone
  const user = await User.find().select("name email phone");
  if (!user) {
    res.status(404).send({ success: false, error: err.message });
  }
  res.status(201).json(user);
});
router.get("/:id", async (req, res) => {
  //without selecting password
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404).json("User Not Availabe");
  }
  res.status(201).json(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404).json("User Not Availabe");
  }
  if (user && bcrypt.compareSync(req.body.password, user.password)) {

   const token = jwt.sign(
      {
      userId: user.id,
      isAdmin: user.isAdmin
      },
      process.env.secret,
      {
        //token experi time 1w= one week
        expiresIn: '1d'
      }
    )
   res.status(201).send({userEmail: user.email, token: token});
  } else {
    res.status(400).send("Password is wrong");
  }
});

router.post('/resister', (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 15),
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });
  user
    .save()
    .then((createdUser) => {
      res.status(201).json(createdUser);
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: err.message });
    });
});

router.delete("/:id", (req, res) => {

  //when object id invalid mongose goes to hank thats why we use this
  if(!mongose.isValidObjectId(req.params.id)) return res.status(400).send("Invalid Id");


  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(201).json("User Delete Sucessfully");
    })
    .catch((err) => {
      res.status(400).send({success:false,error: err.message});
    });
});
router.get('/get/count', async (req, res) => {
  const user = await User.countDocuments()
  if (!user) {
    res.status(404).json("user Not Availabe");
  }
  res.status(201).send({userCount: user});
});
module.exports = router;
