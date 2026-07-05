const admin = require('firebase-admin');

const adminUid = process.env.ADMIN_UID || process.argv[2];
const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountKey.json';

if (!adminUid) {
  console.error('Usage: ADMIN_UID=<uid> node tools/set-admin-claim.js');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = require(keyPath);
} catch (error) {
  console.error(`Could not load service account credentials from ${keyPath}`);
  console.error('Place your Firebase service account JSON file at serviceAccountKey.json or set GOOGLE_APPLICATION_CREDENTIALS.');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

admin.auth()
  .setCustomUserClaims(adminUid, { admin: true })
  .then(() => {
    console.log(`Admin claim set for UID ${adminUid} ✓`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to set admin claim:', error);
    process.exit(1);
  });
