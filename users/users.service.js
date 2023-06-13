const User = require("./users.model");
const ObjectId = require("mongoose").Types.ObjectId;

/**
 * Return all items from database
 */
const findAll = () => User.find();

/**
 * Return an item by given ID
 * @param {string} id
 */
const findById = (id) => {
    const objectId = new ObjectId(id);
    // return Item.findById(objectId).populate("profile");
    return User.findById(objectId)
  };

module.exports = {
    findAll,
    findById,
  };