import mongoose, { model } from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt'; // This is required to hash the password
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        unique: true // only one email
    },
    password: {
        type: String, 
        required: [true, 'Please provide password'],
        minlength: 6
    }
})

// Hash the password before saving - .pre() means it will run this function before aby saving or creation.
userSchema.pre('save', async function() {
    // Checks if THIS document (user) about to be saved had the password modified, or not.
    if (!this.isModified('password')) return // If password not changed, no hashing.
    const salt = await genSalt(10); // 10 rounds standar to hash tje password stronger.
    this.password = await hash(this.password, salt) // this will hash with the password from the user on the schema, using the salt.

})

// Compare password method to each user - when user log, it compares password.
userSchema.methods.comparePassword = async function(candidatePassword) { //the password the user will type.
    return await compare(candidatePassword, this.password) // this.password is already hashed in this step. TRUE or FALSE
}

export default model('User', userSchema);