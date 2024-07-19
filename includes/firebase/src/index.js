/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
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
const _db = getDatabase();

export {
	_app as app,
	_auth as auth,
	_signInWithEmailAndPassword as signInWithEmailAndPassword,
	_onAuthStateChanged as onAuthStateChanged,
	_signOut as signOut,
	_db as getDatabase,
};
