const { execSync } = require('child_process')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())

function replaceStrInFile(filePath, stringsToReplace, replacements) {
  var result = fs.readFileSync(filePath, 'utf8')
  if (typeof stringsToReplace === 'string') {
    result = result.replace(new RegExp(stringsToReplace, 'g'), replacements)
  } else {
    for (let i = 0; i < stringsToReplace.length; i++) {
      result = result.replace(
        new RegExp(stringsToReplace[i], 'g'),
        replacements[i]
      )
    }
  }

  fs.writeFileSync(filePath, result, 'utf8')
}

async function updateIndexHtmlMetadata() {
  const indexHtmlFilePath = `${appDirectory}/build/index.html`
  const commit = execSync('git rev-parse --short HEAD').toString().trim()
  replaceStrInFile(indexHtmlFilePath, 'commit_placeholder', commit)
}

updateIndexHtmlMetadata()
