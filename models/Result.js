import mongoose from 'mongoose';
const resultSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paper:    { type: mongoose.Schema.Types.ObjectId, ref: 'Paper', required: true },
  score:    Number,
  accuracy: Number,
  date:     { type: Date, default: Date.now }
});
export default mongoose.model('Result', resultSchema);
