/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
	sendPasswordResetEmail,
	confirmPasswordReset,
	verifyPasswordResetCode,
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';

function loadFirebaseConfig() {
	const el = document.getElementById('wp-script-module-data-@prc/firebase');
	try {
		const config = JSON.parse(el.textContent);
		return config;
	} catch (err) {
		console.error(err);
		return {};
	}
}

const _app = initializeApp(loadFirebaseConfig());
const _auth = getAuth();
const _signInWithEmailAndPassword = signInWithEmailAndPassword;
const _onAuthStateChanged = onAuthStateChanged;
const _signOut = signOut;
const _sendPasswordResetEmail = sendPasswordResetEmail;
const _confirmPasswordReset = confirmPasswordReset;
const _verifyPasswordResetCode = verifyPasswordResetCode;
const _db = getDatabase();

export {
	_app as app,
	_auth as auth,
	_signInWithEmailAndPassword as signInWithEmailAndPassword,
	_onAuthStateChanged as onAuthStateChanged,
	_signOut as signOut,
	_sendPasswordResetEmail as sendPasswordResetEmail,
	_confirmPasswordReset as confirmPasswordReset,
	_verifyPasswordResetCode as verifyPasswordResetCode,
	_db as getDatabase,
};
