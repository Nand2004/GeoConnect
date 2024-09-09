const mongoose = require("mongoose");

//user schema/model
const developersSchema = new mongoose.Schema(
  {
    name:{
        type: String,
        required: true,
        label: "Developer Name",
    },

    role:{
        type: String,
        required: true,
        label: "Role",
    },

    school:{
        type: String,
        required: true,
        label: "School",
    },
  },
  { collection: "developers" }
);

module.exports = mongoose.model('developers', developersSchema)