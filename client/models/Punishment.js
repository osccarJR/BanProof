import mongoose from 'mongoose';

const punishmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  punishmentType: {
    type: String,
    enum: ['warn', 'mute', 'kick', 'ban'],
    required: true,
  },
  punishmentId: {
    type: String,
    required: true,
  },
  proofType: {
    type: String,
    enum: ['url', 'video', 'image'],
    required: true,
  },
  proofContent: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Punishment = mongoose.models.Punishment || mongoose.model('Punishment', punishmentSchema);

export default Punishment;
