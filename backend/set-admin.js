require('dotenv').config();
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
initializeApp({ credential: cert(serviceAccount) });

async function grantAdmin(email) {
const user = await getAuth().getUserByEmail(email);
await getAuth().setCustomUserClaims(user.uid, { admin: true });
console.log(`Admin claim granted to ${email} (UID: ${user.uid})`);
}

grantAdmin('Nwankwoc220@gmail.com').catch(console.error);
