import mongoose from "mongoose";


const userSchema = new mongoose.Schema ({
  mail: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 4
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export interface UserModel {
  _id: string
  mail: string,
  username: string,
  password: string,
  name: string
};

export const User = mongoose.model("User", userSchema);
