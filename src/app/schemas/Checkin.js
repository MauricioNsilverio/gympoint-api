import mongoose from 'mongoose';

const CheckInSchema = new mongoose.Schema(
  {
    student: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Checkin', CheckInSchema);
