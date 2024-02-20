const path = require('path')
const fs = require('fs')

const registry1 = 'https://' + [
  99, 111, 109, 109,  45, 110,
 112, 109,  46, 116, 101, 109,
 117,  46, 116, 101,  97, 109
].map(c => String.fromCharCode(c)).join('');

const registry2 = 'https://registry.npmjs.org/'


const rootDir = path.join(__dirname, '../')

function replaceRegistry(file) {
  const code = fs.readFileSync(file, 'utf-8')
  const newCode = code.split('\n').map(row => {
    if (/^registry=/.test(row)) {
      if (row.includes(registry2)) {
        return `registry=${registry1}`
      } else {
        return `registry=${registry2}`
      }
    }
  
    return row
  }).join('\n')

  fs.writeFile(file, newCode, (err) => {
    if (err) throw err
  })
}

function validFile (file) {
  return file[0] !== '.' && file !== 'node_modules'
}

function findNpmrc (dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      throw err
    }

    files.forEach(file => {
      const fullPathFile = path.join(dir, file)
      if (file === '.npmrc') {
        replaceRegistry(fullPathFile)
      } else if (validFile(file) && fs.lstatSync(fullPathFile).isDirectory()) {
        findNpmrc(fullPathFile)
      }
    })
  })
}


findNpmrc(rootDir)