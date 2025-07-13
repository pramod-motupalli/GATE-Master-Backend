import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  // This field establishes a direct link to a document in the 'User' collection.
  // It's crucial for identifying who took the test.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This tells Mongoose that the ID stored here belongs to a 'User' document.
    required: true,
  },

  // These fields store information about which specific test was taken.
  // They are simple strings for easy filtering and display.
  subjectId: {
    type: String,
    required: true,
  },
  paperId: {
    type: String,
    required: true,
  },

  // The final calculated score for the attempt.
  score: {
    type: Number,
    required: true,
  },
  
  // The total number of questions in the test, for calculating percentages.
  totalQuestions: {
    type: Number,
    required: true,
  },

  // This field will store the user's answers.
  // Using 'Map' is a good way to store key-value pairs like { questionId: answer }.
  // 'mongoose.Schema.Types.Mixed' allows the 'answer' part to be flexible,
  // accommodating a string (for MCQ/NAT) or an array of strings (for MSQ).
  responses: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },

  // A timestamp that automatically records when the attempt was created.
  // This is useful for sorting attempts by date.
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

// An index on the 'user' field significantly speeds up queries that
// search for all attempts made by a specific user.
attemptSchema.index({ user: 1 });

// The final step is to create the Mongoose model from the schema.
// Mongoose will automatically create a collection named 'attempts' (plural and lowercase) in MongoDB.
export default mongoose.model('Attempt', attemptSchema);