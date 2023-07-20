const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ingridients: [{
        type:Schema.Types.ObjectId,
        ref:'Ingredient' 
    }],
    picture:{
        type:String,
        required: true
    },
    type:{
        type:String,
        required: true
    },
    spicy:{
        type:Boolean,
        required: true
    },
    vegaterien:{
        type:Boolean,
        required: true
    },
    portiomWeight:{
        type:Number,
        required: true
    },
    price:{
        type:Number,
        required: true
    },
    status:{
        type:String,
        required: true
    },
    updatedAt:{
        type:Date,
        default: Date.now,
        required:true
    }

});

const Dish = mongoose.model('Dish', DishSchema);

module.exports = Dish;
