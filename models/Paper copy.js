import mongoose from 'mongoose';
const paperSchema = new mongoose.Schema({
  subject:   { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title:     { type: String, required: true },
  questions: [{ text: String, options: [String], answer: String }]
});
export default mongoose.model('Paper', paperSchema);
