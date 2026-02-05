// credits : kasan
import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.File || mongoose.model('File', FileSchema);
