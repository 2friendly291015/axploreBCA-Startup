const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.setTeacherRole = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  
  if (!context.auth || context.auth.uid !== uid) {
    throw new functions.https.HttpsError('permission-denied', 'You are not authorized to set custom claims.');
  }

  try {
    // Set custom claim for the teacher
    await admin.auth().setCustomUserClaims(uid, { role: 'teacher' });
    return { message: `Custom claims set for ${uid} as teacher` };
  } catch (error) {
    throw new functions.https.HttpsError('unknown', error.message);
  }
});
