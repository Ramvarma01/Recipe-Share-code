const mongoose  = require("mongoose")
const { Schema } = mongoose;

const ingredientSchema = new Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }
  });

const commentSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'users' },
    comment: { type: String },
    post_date: { type: Date, default: Date.now }
    });

const recipeSchema = new Schema(
    {
    // recipe_id: { 
    //     type: String, 
    //     required: true, 
    //     unique: true
    // },
    instructions: { 
        type: String,
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    user_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
    },
    // Array of ingredients with name, quantity, and unit
    ingredients: { 
        type: [ingredientSchema],
        required: true 
    } ,
    description: {
        type: String 
    },
    video: { 
        type: String 
    },
    avg_rating: {
         type: Number, 
         default: 0 
        },
    privacy_status: {
         type: String, 
         enum: ['public', 'private'],
         default: 'public' 
        },
    serving_size: {
        type: Number 
    },
    dietary_preferences: { 
        type: String 
    },
    categories: { 
        type: [String] 
    },
     // Array of URLs for photos
    photos: { 
        type: [String] 
    },
    // Array of user IDs who liked the recipe
    likes: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'users' 
    }],
    tags: { 
        type: [String] 
    } ,
    difficulty_level: { 
        type: String, 
        enum: ['Easy', 'Medium', 'Hard'], 
        default: 'Easy' 
    },
    comments: {
        type: [commentSchema],
        // required: true
    }
 }, { timestamps: true }
);
  
  module.exports = mongoose.model("recipes", recipeSchema);
