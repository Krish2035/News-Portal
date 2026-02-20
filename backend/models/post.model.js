import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    default: "uncategorized",
  },
  image: {
    type: String,
    default: "https://images.pexels.com/photos/3944463/pexels-photo-3944463.jpeg?_gl=1*1v43lwx*_ga*MTkzNjMxMDg1NS4xNzUxODkxNzg4*_ga_8JE65Q40S6*czE3NzE2MDI4NDYkbzIkZzEkdDE3NzE2MDI4NTUkajUxJGwwJGgw",
  },
  content: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
}, {timestamps: true});

const Post = mongoose.model("Post",  postschema)

export default Post