const JWT = require("jsonwebtoken");
const { hashPassword, comprarePassword, } = require('../helpers/authHelper');
const User = require('../models/User');

//Register
const registerController = async (req,res) => {
    try {
        const {name,username,email,password} = req.body;
        //validation
        if(!name || !username || !email || !password){
            return res.send({
                success:false,
                message: 'Please fill all fields',
            })
        }
        if(password.length < 6){
                return res.send({
                    success:false,
                    message: 'password should be 6 character long',
                })
            }
            
            //existing user
            const oldUser = await User.findOne({username})
            if(oldUser)
            {return res.send({
                success:false,
                message: 'Username Taken',
            })
            }
        // existing user with email
        const existingUser = await User.findOne({email:email})
        if(existingUser)
        {return res.send({
            success:false,
            message: 'User ALready Register With this Email-ID',
        })
        }
        //hashed password
        const hashedPassword = await hashPassword(password);

        //save user
        const user = await User({name,username,email,password:hashedPassword}).save()

        return  res.send({
            success:true,
            message:'Registeration Successfull Please login'
        })
    } catch (error) {
        console.log(error);
        return res.send({
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
            return res.send({
                success:false,
                message:"Please fill all fields"
            })
        }

        //find user
        const user = await User.findOne({username})
        if(!user){
            return res.send({
                success:false,
                message:"user not found"
            })
        }

        //match password
        const match = await comprarePassword(password,user.password);
        if(!match){
            return res.send({
                success:false,
                message:"incorrect password"
            })
        }
        //TOKEN JWT
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECURE, {
            expiresIn : "7d"
        })
        
        //undefine Password
        user.password = undefined;
        res.send({
            success:true,
         message:"login successfully",
         token, 
         user
        });

    } catch (error) {
        console.log(error);
        return res.send({
            success:false,
            message:'Error in login API',
            error
        });
    }
};


module.exports = {registerController,loginController}