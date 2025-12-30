const fs = require('fs');
const path = require('path');

const version = process.argv[2];
const appJsonPath = path.resolve(__dirname, '../app.json');

if (!version) {
    console.error('Please provide a version argument');
    process.exit(1);
}

const content = fs.readFileSync(appJsonPath, 'utf8');
const json = JSON.parse(content);

console.log(`Bumping app.json version from ${json.expo.version} to ${version}`);
json.expo.version = version;

fs.writeFileSync(appJsonPath, JSON.stringify(json, null, 2) + '\n');
