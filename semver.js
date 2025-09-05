#!/usr/bin/env node

const semver = require('semver');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(`
Usage: node semver.js <command> [arguments]

Commands:
  diff <version1> <version2>     - Compare two versions and return difference type
  inc <version> <type>          - Increment version by type (major|minor|patch)
  current                       - Get current version from package.json
  
Examples:
  node semver.js diff 19.1.2 19.2.0     # Returns: minor
  node semver.js inc 1.0.0 major        # Returns: 2.0.0
  node semver.js current                 # Returns: 1.0.0
`);
}

function getCurrentVersion() {
  try {
    const pkg = require('./package.json');
    return pkg.version;
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    process.exit(1);
  }
}

function updatePackageVersion(newVersion) {
  try {
    const fs = require('fs');
    const pkg = require('./package.json');
    pkg.version = newVersion;
    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
    return newVersion;
  } catch (error) {
    console.error('Error updating package.json:', error.message);
    process.exit(1);
  }
}

switch (command) {
  case 'diff': {
    const [version1, version2] = args.slice(1);
    if (!version1 || !version2) {
      console.error('Error: diff requires two versions');
      process.exit(1);
    }

    // Clean versions (remove 'v' prefix if present)
    const clean1 = version1.replace(/^v/, '');
    const clean2 = version2.replace(/^v/, '');

    try {
      const diff = semver.diff(clean1, clean2);
      console.log(diff || 'patch'); // Default to patch if no diff
    } catch (error) {
      console.error('Error comparing versions:', error.message);
      process.exit(1);
    }
    break;
  }

  case 'inc': {
    const [version, type] = args.slice(1);
    if (!version || !type) {
      console.error('Error: inc requires version and type (major|minor|patch)');
      process.exit(1);
    }

    try {
      const newVersion = semver.inc(version, type);
      console.log(newVersion);
    } catch (error) {
      console.error('Error incrementing version:', error.message);
      process.exit(1);
    }
    break;
  }

  case 'current': {
    const currentVersion = getCurrentVersion();
    console.log(currentVersion);
    break;
  }

  case 'update': {
    const [newVersion] = args.slice(1);
    if (!newVersion) {
      console.error('Error: update requires new version');
      process.exit(1);
    }

    const result = updatePackageVersion(newVersion);
    console.log(result);
    break;
  }

  case 'analyze': {
    // Special command for workflow: analyze multiple version changes and determine bump type
    const iosOld = args[1];
    const iosNew = args[2];
    const androidOld = args[3];
    const androidNew = args[4];

    let bumpType = 'patch'; // Default

    if (iosOld && iosNew && iosOld !== 'null' && iosNew !== 'null') {
      const iosDiff = semver.diff(
        iosOld.replace(/^v/, ''),
        iosNew.replace(/^v/, '')
      );
      console.error(`📱 iOS: ${iosOld} → ${iosNew} (${iosDiff})`);

      if (iosDiff === 'major') {
        bumpType = 'major';
      } else if (iosDiff === 'minor' && bumpType !== 'major') {
        bumpType = 'minor';
      }
    }

    if (
      androidOld &&
      androidNew &&
      androidOld !== 'null' &&
      androidNew !== 'null'
    ) {
      const androidDiff = semver.diff(
        androidOld.replace(/^v/, ''),
        androidNew.replace(/^v/, '')
      );
      console.error(
        `🤖 Android: ${androidOld} → ${androidNew} (${androidDiff})`
      );

      if (androidDiff === 'major') {
        bumpType = 'major';
      } else if (androidDiff === 'minor' && bumpType !== 'major') {
        bumpType = 'minor';
      }
    }

    console.error(`📈 Determined bump type: ${bumpType}`);
    console.log(bumpType);
    break;
  }

  default:
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}
