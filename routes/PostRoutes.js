const express = require("express");
const { createPostController, getAllPostContoller, getUserPostContoller, deletePostController, updatePostController} = require("../controllers/PostController");

//router object
const router =express.Router();

//Create Post
router.post("/create-post",createPostController);

//GET ALL POSTs
router.get("/get-all-post", getAllPostContoller);

// GET USER POSTs
router.post("/get-user-post",getUserPostContoller);
// router.get("/get-user-post",getUserPostContoller);

// //DELEET POST
router.delete("/delete-post/:id",deletePostController);

//UPDATE POST
router.put("/update-post/:id",updatePostController);


//export
module.exports =router;