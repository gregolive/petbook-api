import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    img_url: {
      type: String,
      default: null,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

PostSchema.virtual('url').get(function() {
  return '/post/' + this._id;
});

export default mongoose.model('Post', PostSchema);
