const bcrypt = require("bcrypt");

//Hash Function
exports.hashPassword =(password) => {
    return new Promise((resolve,reject) => {
        bcrypt.genSalt(10,(err,salt) => {
            if(err){
                reject(err)
            }
            bcrypt.hash(password,salt, (err,hash) => {
                if(err){
                    reject(err)
                }
                resolve(hash)
            })
        })
    })
};

//compare || Decrypt function
exports.comprarePassword = (password, hashed) => {
    return bcrypt.compare(password, hashed);
};