const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String, required: true
    },
    displayName: String,
    email: String,
    tasks:[{type:mongoose.Schema.Types.ObjectId, ref:'Task'}]
        
    
});

module.exports = mongoose.model('User', userSchema);
