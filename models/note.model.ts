import mongoose from "mongoose";


const Schema = mongoose.Schema;

const noteSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 40
  },
  content: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 200
  },
  priority: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  project_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Project"
  },
  completed: {
    type: Boolean,
    required: true,
  },
  assigned_user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});

export interface NoteModel {
  _id: string,
  name: string,
  title: string,
  content: string,
  priority: number,
  project_id: string,
  completed: boolean,
  assigned_user_id: string
}

export const Note = mongoose.model("Note", noteSchema);
