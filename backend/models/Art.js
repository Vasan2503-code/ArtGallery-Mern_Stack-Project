const mongoose = require("mongoose")

const artSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true,
    min: 0
  },
  images: [
    {
      url: {
        type: String,
        required: true
      },
      public_id: {
        type: String
      }
    }
  ],
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: String,
    enum: ["painting", "sketch", "digital", "photography", "other"],
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
})

module.exports = mongoose.model("Art", artSchema);