const { Category } = require("../Models/Category");
const express = require("express");
const router = express.Router();
const mongose = require("mongoose");

router.get(``, async (req, res) => {
  const category = await Category.find();
  if (!category) {
    res.status(404).send({success:false,error: err.message});
  }
  res.status(201).json(category);
});

router.post(``, (req, res) => {
  const category = new Category({
    name: req.body.name,
    icon: req.body.icon,
  });
  category
    .save()
    .then((createdCategory) => {
      res.status(201).json(createdCategory);
    })
    .catch((err) => {
      res.status(400).send({success:false,error: err.message});
    });
});

router.delete("/:id", (req, res) => {

  //when object id invalid mongose goes to hank thats why we use this
  if(!mongose.isValidObjectId(req.params.id)) return res.status(400).send("Invalid Id");


  Category.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(201).json("Category Delete Sucessfully");
    })
    .catch((err) => {
      res.status(400).send({success:false,error: err.message});
    });
});

router.put('/:id', (req, res) => {

  if(!mongose.isValidObjectId(req.params.id)) return res.status(400).send("Invalid Id");


      Category.findByIdAndUpdate(req.params.id,{
            name: req.body.name,
            icon: req.body.icon
      },{ new:true}
      ).then((updateCate) => {
          res.status(201).json(updateCate);
        }) 
        .catch((err) => {
          res.status(400).send({success:false,error: err.message});
        });
    });

module.exports = router;
