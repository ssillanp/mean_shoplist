const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User schema
const ShopListSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type:String,
        required: true
    },
    items: [{
        itemName: {
            type: String
        },
        done: {
            type: Boolean
        }
    }]
});

const ShopList = module.exports = mongoose.model('Shoplist', ShopListSchema);

module.exports.getListByUserId = (uid, callback) => {
    ShopList.find({userId:uid}, callback)
}

module.exports.addList = (newList, callback) => {
    newList.save(callback)
}

// module.exports.updateList = (List, callback) => {
//     List.save(callback)
// }