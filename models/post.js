import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

PostSchema.virtual('url').get(function() {
  return '/post/' + this._id;
});

export default mongoose.model('Post', PostSchema);
