import Project from '../models/Project.js'

export async function getProjects(req, res) {
  try {
    const projects = await Project.find().sort({ order: 1 })
    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects' })
  }
}
