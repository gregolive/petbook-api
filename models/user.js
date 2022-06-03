import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      default:'email',
    },
    provider_id:{
      type: String,
      default: null,
    },
    password: {
      type: String,
      minLength: 6,
    },
    created_at: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
    updated_at: {
      type: Date,
      default: () => Date.now(),
    },
  }, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

UserSchema.virtual('url').get(function() {
  return '/user/' + this._id;
});

export default mongoose.model('User', UserSchema);
