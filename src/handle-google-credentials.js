const fs = require('fs');
const path = require('path');

function hasCredentialsFile(credentials) {
    return fs.existsSync(credentials);
}

function setCredentials(credentials) {
    process.env['GOOGLE_APPLICATION_CREDENTIALS'] = credentials;
}

function handleGoogleCredentials(cwd) {
    const GOOGLE_CREDENTIALS = path.join(cwd, 'google-credentials.json');

    if (!hasCredentialsFile(GOOGLE_CREDENTIALS)) {
        console.error(`Unable to find Google credentials. Please put a file called 'google-credentials.json' to ${cwd}. Check https://gist.github.com/mdix/b1b9cf88180d0d33f5ce98132f4359a2 for an example.`);
        process.exit(1);
    }

    setCredentials(GOOGLE_CREDENTIALS);
}

module.exports = handleGoogleCredentials;


