import { Schema, Document, model} from "mongoose";


export interface IUser extends Document {
  mail: string,
  username: string,
  password: string,
  name: string
}

const userSchema = new Schema ({
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

export const User = model<IUser>("User", userSchema);
