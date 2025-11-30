import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema ({
        username: {type: String, require: true, unique: true},
        password: {type: String, require: true},
        tokens: {type: Number, default: 100}
})

export const User = mongoose.model('User', userSchema)