import mongoose from 'mongoose';

const CredentialSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store as plain text for now (can hash later)
});

export default mongoose.models.Credential || mongoose.model('Credential', CredentialSchema);
