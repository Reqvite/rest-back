const {Schema, SchemaTypes, model} = require('mongoose')

const AdministratorSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    password: {
        type: Number,
        required: [true, "Password is required"],
    },
    restaurant_id: {
        type: SchemaTypes.ObjectId,
        ref: 'Restaurant',
        required: [true, "Restaurant_id is required"],
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: [true, "Gender is required"],
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    picture: {
        type: String,
        required: [true, "Picture is required"],
    }

})

const Administrator = model('Administrator', AdministratorSchema)

module.exports = {
    Administrator,
  };