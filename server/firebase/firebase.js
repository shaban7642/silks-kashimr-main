const adminFb = require('firebase-admin');

const serviceAccount = require('../config/fbserviceAccountKey.json');

adminFb.initializeApp({
    credential: adminFb.credential.cert(serviceAccount),
});

module.exports = adminFb;
