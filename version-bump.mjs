import { readFileSync, writeFileSync } from 'fs';

const targetVersion = process.argv[2];

function bumpVersion(version) {
	const [major, minor, patch] = version.split('.').map(Number);
	return `${major}.${minor}.${patch + 1}`;
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const manifestJson = JSON.parse(readFileSync('manifest.json', 'utf8'));

const newVersion = targetVersion || bumpVersion(packageJson.version);

packageJson.version = newVersion;
manifestJson.version = newVersion;

writeFileSync('package.json', JSON.stringify(packageJson, null, '\t'));
writeFileSync('manifest.json', JSON.stringify(manifestJson, null, '\t'));
