import blockContent from './blockContent'
import tour from './tour'
import article from './article'
import author from './author'
import category from './category'

export const schemaTypes = [
  // Content types
  tour,
  article,

  // Reference types
  author,
  category,

  // Object types
  blockContent,
]
