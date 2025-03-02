const Recipes = require("../models/Recipes");

//create Recipe post
const createPostController =async(req,res) => {
    try{
        const {
            instructions,
            title,
            user_id,
            ingredients,
            description,
            video,
            avg_rating,
            privacy_status,
            serving_size,
            dietary_preferences,
            categories,
            photos,
            likes,
            tags,
            difficulty_level,
            comments
        } = req.body;
// console.log(req.auth);
// const user_id = req.auth.user._id; // Access user_id from auth

    //validate
    if (!instructions || !title || !user_id ||!ingredients) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    //saving the recipe in to Database
    const newRecipe = new Recipes({
        instructions,
        title,
        user_id,
        ingredients,
        description,
        video,
        avg_rating,
        privacy_status,
        serving_size,
        dietary_preferences,
        categories,
        photos,
        likes,
        tags,
        difficulty_level,
        comments
    });
    await newRecipe.save();

    res.status(201).send({
      success: true,
      message: "Post Created Successfully",
      recipe: newRecipe,
    });
    }catch(error){
        console.log(error);
        res.status(500).send({
        success: false,
        message: "Error In Create Post Api",
        error,
      });
    }
};

// GET ALL POSTS
const getAllPostContoller = async (req, res) => {
  try {
    const posts = await Recipes
      .find({privacy_status:"public"})
      .populate("user_id", "_id, username")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All Posts Data",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get All Post API",
      error,
    });
  }
};


// GET USERS ALL POSTS
const getUserPostContoller = async (req, res) => {
  try {
    const {user_id} = req.body;
    const posts = await Recipes
      .find({user_id})
      .populate("user_id", "_id, username")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "User Posts Data",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get User Post API",
      error,
    });
  }
};

//DELETE POSTED RECIPES
const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    await Recipes.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in delete post api",
      error,
    });
  }
};

//update posted recipe
const updatePostController =async(req,res) => {
  try{
      const {
          instructions,
          title,
          user_id,
          ingredients,
          description,
          video,
          avg_rating,
          privacy_status,
          serving_size,
          dietary_preferences,
          categories,
          photos,
          likes,
          tags,
          difficulty_level,
          comments
      } = req.body;
      const { id } = req.params;

  //validate
  if (!instructions || !title ||!ingredients) {
    return res.status(500).send({
      success: false,
      message: "Please Provide All Fields",
    });
  }

  //saving the recipe in to Database
  const Recipe = ({
      instructions,
      title,
      user_id,
      ingredients,
      description,
      video,
      avg_rating,
      privacy_status,
      serving_size,
      dietary_preferences,
      categories,
      photos,
      likes,
      tags,
      difficulty_level,
      comments
  });
   const updatedRecipe = await Recipes.findOneAndUpdate(
    { _id:id },
    {
      title,
      instructions,
      description,
      video,
      serving_size,
      dietary_preferences,
      ingredients,
      photos,
      tags,
      difficulty_level,
      privacy_status,
    },
    { new: true }
  );;

  res.status(201).send({
    success: true,
    message: "Recipe updated Successfully",
    recipe: updatedRecipe,
  });
  }catch(error){
      console.log(error);
      res.status(500).send({
      success: false,
      message: "Error In Create Post Api",
      error,
    });
  }
};
module.exports = {createPostController,getAllPostContoller,getUserPostContoller,deletePostController, updatePostController};
