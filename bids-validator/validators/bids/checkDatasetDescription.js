const Issue = require('../../utils').issues.Issue

const checkDatasetDescription = jsonContentsDict => {
  let issues = []
  const jsonFilePaths = Object.keys(jsonContentsDict)
  const hasDatasetDescription = jsonFilePaths.some(path => {
    return path == '/dataset_description.json'
  })
  if (!hasDatasetDescription) {
    issues.push(new Issue({ code: 57 }))
  } else {
    const datasetDescription = jsonContentsDict['/dataset_description.json']

    // check to ensure that the dataset description Authors are
    // properly formatted
    issues = issues.concat(checkAuthorField(datasetDescription.Authors))
  }
  return issues
}

const checkAuthorField = authors => {
  const issues = []
  // because this test happens before schema validation,
  // we have to make sure that authors is an array
  if (authors && typeof authors == 'object' && authors.length) {
    // if any author has more than one comma, throw an error
    authors.forEach(author => {
      if (author.split(',').length > 2) {
        issues.push(new Issue({ code: 103, evidence: author }))
      }
    })
    // if authors is length 1, we want a warning for a single comma
    // and an error for multiple commas
    if (authors.length == 1) {
      const author = authors[0]
      // check the number of commas in the single author field
      if (author.split(',').length <= 2) {
        // if there is one or less comma in the author field,
        // we suspect that the curator has not listed everyone involved
        issues.push(new Issue({ code: 102, evidence: author }))
      } else if (author.split(',').length > 2) {
        // if there are too many commas in the author field,
        // we suspect that the curator has listed all authors in a single
        // entry in the authors array... which is against bids spec
        issues.push(new Issue({ code: 103, evidence: author }))
      }
    }
  }
  return issues
}
module.exports = checkDatasetDescription