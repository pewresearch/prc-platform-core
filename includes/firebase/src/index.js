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
import {
	getDatabase,
	ref,
	push,
	set,
	update,
	remove,
	get,
	child,
	query,
	orderByChild,
	orderByKey,
	orderByValue,
	limitToFirst,
	limitToLast,
	startAt,
	endAt,
	equalTo,
	onValue,
	off,
	serverTimestamp,
} from 'firebase/database';

function loadFirebaseConfig() {
	const el = document.getElementById('wp-script-module-data-@prc/firebase');
	try {
		const config = JSON.parse(el.textContent);
		return config;
	} catch (err) {
		console.error('loadFirebaseConfig error:', err);
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
const _db = getDatabase;
const _ref = ref;
const _push = push;
const _set = set;
const _update = update;
const _remove = remove;
const _get = get;
const _child = child;
const _query = query;
const _orderByChild = orderByChild;
const _orderByKey = orderByKey;
const _orderByValue = orderByValue;
const _limitToFirst = limitToFirst;
const _limitToLast = limitToLast;
const _startAt = startAt;
const _endAt = endAt;
const _equalTo = equalTo;
const _onValue = onValue;
const _off = off;
const _serverTimestamp = serverTimestamp;

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
	_ref as ref,
	_push as push,
	_set as set,
	_update as update,
	_remove as remove,
	_get as get,
	_child as child,
	_query as query,
	_orderByChild as orderByChild,
	_orderByKey as orderByKey,
	_orderByValue as orderByValue,
	_limitToFirst as limitToFirst,
	_limitToLast as limitToLast,
	_startAt as startAt,
	_endAt as endAt,
	_equalTo as equalTo,
	_onValue as onValue,
	_off as off,
	_serverTimestamp as serverTimestamp,
};
