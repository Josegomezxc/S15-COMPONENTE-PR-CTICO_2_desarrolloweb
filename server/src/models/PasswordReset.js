import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  usado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('PasswordReset', passwordResetSchema);
