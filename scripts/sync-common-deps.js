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
  path.join(__dirname, '../packages/fishpond-components'),
  path.join(__dirname, '../packages/polymita-runtime/packages'),
  path.join(__dirname, '../packages/polymita-runtime/packages/example'),
];

packages.forEach((packagePathDir) => {
  fs.readdirSync(packagePathDir).forEach((packageName) => {
    const packagePath = path.join(packagePathDir, packageName);
    updatePackageJson(packagePath);
  });
});


function updatePackageJson (packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json')
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath);

    ['dependencies', 'devDependencies', 'peerDependencies'].forEach((depType) => {
      if (packageJson[depType]) {
        for (const dep in deps) {
          if (packageJson[depType][dep]) {
            packageJson[depType][dep] = deps[dep]
          }
        }
      }
    })

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  }
}