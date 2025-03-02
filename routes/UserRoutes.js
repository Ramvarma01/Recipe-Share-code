const express = require('express');
const { registerController, loginController, updateUserController, requireSingIn } = require('../controllers/UserController');

//router Object
const router = express.Router();

//routes
router.post('/register', registerController);
router.post('/login', loginController);
router.put("/update-user",updateUserController);

module.exports = router;