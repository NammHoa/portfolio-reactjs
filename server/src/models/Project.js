import mongoose from 'mongoose'

const linkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false }
)

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    period: { type: String, required: true },
    headlineLines: { type: [String], required: true },
    description: { type: String, required: true },
    highlights: { type: [String], required: true },
    tags: { type: [String], required: true },
    link: String,
    linkLabel: String,
    links: [linkSchema],
    image: String,
    imageAspect: String,
    logo: String,
    company: String,
    order: { type: Number, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)
