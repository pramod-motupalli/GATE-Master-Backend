import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  
  // Array to store references to all attempts made by this user
  attempts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attempt' // This refers to documents in the 'Attempt' collection
  }]
});

export default mongoose.model('User', userSchema);