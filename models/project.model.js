import mongoose from "mongoose";


const Schema = mongoose.Schema;

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

export const Project = mongoose.model("Project", projectSchema);
