/**
 * External Dependencies
 */
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/auth';

function loadScript(slug, script) {
	if (!window[slug]) {
		window[slug] = script;
	}
}

// Establish the main firebase config object
const { prcFirebaseConfig, prcFirebaseInteractivesConfig } = window;

loadScript('firebase', firebase.initializeApp(prcFirebaseConfig));
loadScript('firebaseDb', firebase.database());
loadScript('firebaseAuth', firebase.auth());

// Legacy Backport: TO BE REMOVED
loadScript(
	'interactivesDb',
	firebase.initializeApp(prcFirebaseInteractivesConfig, 'interactivesDb')
);
