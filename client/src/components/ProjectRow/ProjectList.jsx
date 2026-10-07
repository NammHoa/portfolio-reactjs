import ProjectRow from './ProjectRow'

// Rows with a visual alternate left/right; consecutive text-only projects
// are gathered into one two-column set of cards so they don't leave
// half of the row empty.
function ProjectList({ projects, onOpen }) {
  const hasVisual = (project) => Boolean(project.image || project.logo)
  const segments = []

  projects.forEach((project) => {
    const last = segments[segments.length - 1]
    if (hasVisual(project)) {
      segments.push({ type: 'row', items: [project] })
    } else if (last && last.type === 'cards') {
      last.items.push(project)
    } else {
      segments.push({ type: 'cards', items: [project] })
    }
  })

  let rowIndex = 0
  let delay = 0

  return (
    <div className="projects__list">
      {segments.map((segment) => {
        if (segment.type === 'row') {
          const project = segment.items[0]
          const reverse = rowIndex % 2 === 1
          rowIndex += 1
          return (
            <ProjectRow
              key={project._id}
              project={project}
              delayIndex={delay++}
              reverse={reverse}
              onOpen={(article) => onOpen(project._id, article)}
            />
          )
        }
        return (
          <div key={segment.items[0]._id} className="projects__cards">
            {segment.items.map((project) => (
              <ProjectRow
                key={project._id}
                project={project}
                delayIndex={delay++}
                reverse={false}
                onOpen={(article) => onOpen(project._id, article)}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default ProjectList
