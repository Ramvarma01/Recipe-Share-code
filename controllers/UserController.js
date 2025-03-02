const JWT = require("jsonwebtoken");
// const { hashPassword, comprarePassword, } = require('../helpers/authHelper');
const Users = require('../models/Users');
const bcrypt = require("bcrypt");
// var { expressjwt: jwt } = require("express-jwt");

//middleware
// const requireSingIn = jwt({
//     secret: process.env.JWT_SECURE,
//     algorithms: ["HS256"],
//   });

//Register
const registerController = async (req,res) => {
    try {
        const {name,username,email,password} = req.body;
        //validation
        if(!name || !username || !email || !password){
            return res.status(400).send({
                success:false,
                message: 'Please fill all fields',
            })
        }
        if(password.length < 6){
                return res.status(400).send({
                    success:false,
                    message: 'password should be 6 character long',
                })
            }
            
            //existing user
            const oldUser = await Users.findOne({username})
            if(oldUser)
            {return res.status(409).send({
                success:false,
                message: 'Username Taken',
            })
            }
        // existing user with email
        const existingUser = await Users.findOne({email:email})
        if(existingUser)
        {return res.status(409).send({
            success:false,
            message: 'User ALready Register With this Email-ID',
        })
        }
        //hashed password
        // const hashedPassword = await hashPassword(password)
        const hashedPassword= await bcrypt.hash(password,10)

        //save user
        const user = await Users({name,username,email,password:hashedPassword}).save()

        return  res.status(200).send({
            success:true,
            message:'Registeration Successfull Please login'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in register API',
            error:error,
        });
    }
};


//Login
const loginController = async (req,res) => {
    try {
        const {username,password} = req.body;
        
        //validation
        if(!username || !password){
            return res.status(400).send({
                success:false,
                message:"Please fill all fields"
            })
        }

        //find user
        const user = await Users.findOne({username})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"user not found"
            })
        }

        //match password
        // const match = await comprarePassword(password,user.password);
        const match = await bcrypt.compare(password, user.password);;
       
        if(!match){
            return res.status(401).send({
                success:false,
                message:"incorrect password"
            })
        }
        //TOKEN JWT
        const token =JWT.sign({_id: user._id}, process.env.JWT_SECURE, {
            expiresIn : "7d"
        })
        
        //undefine Password
        user.password = undefined;
        res.status(200).send({
            success:true,
         message:"login successfully",
         token, 
         user,
        //  password
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in login API',
            error
        });
    }
};

//update user
const updateUserController = async (req, res) => {
    try {
      const { name, username, email, password, profileImage,bio } = req.body;

    //   const profile_image = await cloudinary.uploader.upload(req.file.buffer, { folder: 'profile_images' });
      
      //user find
      const user = await Users.findOne({ email });
      if (!user) { 
        return res.status(404).send({
             success: false, 
             message: "User not found" ,
            }); 
        }

        //existing user
        // const oldUser = await Users.findOne({username})
        const oldUser = await Users.findOne({
            username, 
            email: { $ne: email }
          });
        if(oldUser)
        {return res.status(409).send({
            success:false,
            message: 'Username Taken',
        })
        }
        //password validate
    //   if (password && password.length < 6) {
    //     return res.status(400).send({
    //       success: false,
    //       message: "Password is required and should be 6 character long",
    //     });
    //   }
     
      const hashedPassword = password ? await bcrypt.hash(password,10) : undefined;
      
      //updated useer
      const updatedUser = await Users.findOneAndUpdate(
        { email },
        {
          name: name || user.name,
          username: username || user.username,
          password: hashedPassword || user.password,
          profileImage: profileImage || user.profileImage,
          bio: bio || user.bio,
        },
        { new: true }
      );
      updatedUser.password = undefined;
      res.status(200).send({
        success: true,
        message: "Profile Updated",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In User Update Api",
        error,
      });
    }
  };

module.exports = {registerController,loginController,updateUserController}