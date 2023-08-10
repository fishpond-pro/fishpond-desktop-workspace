const path = require('node:path')
const fs = require('node:fs')

const deps = {
  react: '18.2.0',
  'react-dom': '18.2.0',
  '@types/react': '18.2.18',
  '@types/react-dom': '18.2.7'
}


const packages = [
  path.join(__dirname, '../packages/'),
  path.join(__dirname, '../packages/fishpond-components/packages'),
  path.join(__dirname, '../packages/polymita-runtime/packages'),
  path.join(__dirname, '../packages/polymita-runtime/packages/example'),
];

packages.forEach((packagePathDir) => {
  fs.readdirSync(packagePathDir).forEach((packageName) => {
    const packagePath = path.join(packagePathDir, packageName);
    updatePackageJson(packagePath);
    updateIgnore(packagePath)
  });
});

console.log('Sync common dependencies done!');

function updateIgnore (packagePath) {
  const fp = path.join(packagePath, '.gitignore')
  if (fs.existsSync(fp)) {
    const lines = fs.readFileSync(fp, 'utf-8').split('\n')
    if (!lines.includes('.test/')) {
      lines.push('.test/')
      const newIgnore = lines.join('\n')
      fs.writeFileSync(fp, newIgnore)
    }
  }
}

function updatePackageJson (packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json')
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath);

    // for dependencies
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach((depType) => {
      if (packageJson[depType]) {
        for (const dep in deps) {
          if (packageJson[depType][dep]) {
            packageJson[depType][dep] = deps[dep]
          }
        }
      }
    })

    // for scripts
    if (packageJson.scripts) {
      if (packageJson.dependencies?.['@polymita/server']) {
        if (!packageJson.scripts.test) {
          packageJson.scripts.test = 'polymita test'
        }
      } else {
        if (
          packageJson.scripts.test === 'polymita test'
        ) {
          delete packageJson.scripts.test
        }
      }
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  }
}