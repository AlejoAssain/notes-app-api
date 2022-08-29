import { Schema, Document, model } from "mongoose";


export interface IProject extends Document {
  name: string,
  description: string,
  owner_id: string,
  participants_id: Array<string>,
};

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  description: {
    type: String,
    maxlength: 80
  },
  owner_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  participants_id: [Schema.Types.ObjectId]
}, {
  timestamps: true
});

export const Project = model<IProject>("Project", projectSchema);
