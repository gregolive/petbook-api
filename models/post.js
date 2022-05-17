import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 100,
    },
    body: {
      type: String,
      required: true,
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
  return '/post/' + this.formatted_title;
});

export default mongoose.model('Post', PostSchema);
