import mongoose from "mongoose";


export interface IUser extends mongoose.Document {
  mail: string,
  username: string,
  password: string,
  name: string
}

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

export const User = mongoose.model<IUser>("User", userSchema);
