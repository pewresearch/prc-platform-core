/* eslint-disable max-lines */
import {
	useState,
	useEffect,
	useContext,
	createContext,
} from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal Dependencies
 */
import { getTodaysDate, stringIdGenerator } from './helpers';

// Firebase is active globaly, we don't need to do any setup here.
// const { firebase } = window;
import * as firebase from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseDatabase from 'firebase/database';

const authContext = createContext();
console.log('does firebase exist?!');
console.log(firebaseAuth);
const { onAuthStateChanged } = firebaseAuth;
console.log(onAuthStateChanged);
// Provider hook that creates auth object and handles state
// eslint-disable-next-line max-lines-per-function
const useProvideAuth = () => {
	const [user, setUser] = useState(false);

	// Wrap any Firebase methods we want to use making sure ...
	// ... to save the user to state.
	const signin = (email, password) =>
		new Promise((resolve, reject) => {
			firebaseAuth
				.signInWithEmailAndPassword(email, password)
				.then((response) => {
					setUser(response.user);
					resolve(response.user);
				})
				.catch((error) => {
					reject(error);
				});
		});

	const signinWithToken = (token) =>
		new Promise((resolve, reject) => {
			firebaseAuth
				.signInWithCustomToken(token)
				.then((data) => {
					resolve(data);
				})
				.catch((e) => {
					reject(e);
				});
		});

	const signup = (data) => {
		return new Promise((resolve, reject) => {
			apiFetch({
				path: `/prc-api/v3/accounts/register/`,
				method: 'POST',
				data: {
					...data,
					created: getTodaysDate(),
				},
			})
				.then((result) => {
					firebaseAuth
						.signInWithCustomToken(result)
						.then((userData) => {
							resolve(userData);
						})
						.catch((error) => {
							reject(error);
						});
				})
				.catch((error) => {
					reject(error);
				});
		});
	};

	const signout = () =>
		new Promise((resolve) => {
			firebaseAuth.signOut().then(() => {
				setUser(false);
				resolve(true);
			});
		});

	// const sendPasswordResetEmail = (email) =>
	// 	new Promise((resolve) => {
	// 		firebase
	// 			.auth()
	// 			.sendPasswordResetEmail(email)
	// 			.then(() => {
	// 				resolve(true);
	// 			});
	// 	});

	const sendPasswordResetEmail = (email) =>
		new Promise((resolve, reject) => {
			firebaseAuth
				.sendPasswordResetEmail(email)
				.then(() => {
					resolve(true);
				})
				.catch((error) => {
					reject(error);
				});
		});

	const verifyPasswordResetToken = (token) =>
		new Promise((resolve, reject) => {
			firebaseAuth
				.verifyPasswordResetCode(token)
				.then(() => {
					resolve(true);
				})
				.catch((error) => {
					reject(error);
				});
		});

	const confirmPasswordReset = (token, newPassword) =>
		new Promise((resolve, reject) => {
			firebaseAuth
				.confirmPasswordReset(token, newPassword)
				.then(() => {
					resolve(true);
				})
				.catch((error) => {
					reject(error);
				});
		});

	const getUserData = (uuid) =>
		new Promise((resolve, reject) => {
			firebaseDatabase
				.ref('users')
				.child(uuid)
				.once('value')
				.then((snapshot) => {
					if (
						'object' === typeof snapshot.val() &&
						null !== snapshot.val()
					) {
						resolve(snapshot.val());
					} else {
						reject();
					}
				})
				.catch((error) => reject(error));
		});

	const deleteUser = (uuid, emailConfirmation) =>
		new Promise((resolve, reject) => {
			const u = firebaseAuth.currentUser;
			if (emailConfirmation === user.email && uuid === user.uid) {
				u.delete()
					.then(() => {
						resolve(true);
					})
					.catch((error) => {
						reject(error);
					});
			} else {
				reject();
			}
		});

	const updatePassword = (uuid, newPassword) =>
		new Promise((resolve, reject) => {
			const u = firebaseAuth.currentUser;
			if (uuid === u.uid) {
				u.updatePassword(newPassword)
					.then(() => {
						resolve();
					})
					.catch((error) => {
						reject(error);
					});
			} else {
				reject();
			}
		});

	/**
	 *
	 * @param {uuid} uuid
	 * @param {data} data
	 */
	const logDatasetDownload = (uuid, data) => {
		const { id, title, url, downloadUrl, siteId } = data;
		return new Promise((resolve, reject) => {
			apiFetch({
				path: `/prc-api/v2/datasets/log-download`,
				method: 'POST',
				data: {
					id,
					siteId,
				},
			})
				.then(() => {
					// Log Download to User Profile
					firebaseDatabase
						.ref(`users/${uuid}/datasets/${id}`)
						.update({
							title,
							downloaded: getTodaysDate(),
							url,
							downloadURL: downloadUrl,
						})
						.then(() => {
							resolve(true);
						})
						.catch((e) => {
							reject(e);
						});
				})
				.catch((e) => {
					reject(e);
				});
		});
	};

	const atpConsent = (uuid, doesConsent) =>
		new Promise((resolve, reject) => {
			firebase
				.database()
				.ref(`users/${uuid}/atpLegal/}`)
				.update({ accepted: doesConsent })
				.then(() => {
					resolve(true);
				})
				.catch((e) => {
					reject(e);
				});
		});

	const getGroup = (groupId) =>
		new Promise((resolve, reject) => {
			if (undefined === groupId || null === groupId) {
				reject('No groupId specified');
			}
			firebaseDatabase
				.ref('groups')
				.child(groupId)
				.once('value')
				.then((snapshot) => {
					if (
						'object' === typeof snapshot.val() &&
						null !== snapshot.val()
					) {
						resolve(snapshot.val());
					} else {
						reject('malformed db data error', snapshot);
					}
				})
				.catch((e) => {
					reject(e);
				});
		});

	const logGroupToUser = (groupId, groupName, quizId, quizTitle) =>
		new Promise((resolve, reject) => {
			if (!user) {
				reject('Please login');
			}
			const { uid } = user;
			const date = getTodaysDate();

			// Create new group
			firebaseDatabase
				.ref(`users/${uid}/groups/${groupId}`)
				.update({
					name: groupName,
					created: date,
					total: 0,
					quizId,
					quizTitle,
					groupVersion: 2,
				})
				.then(() => {
					// Resolve promise request
					resolve(true);
				})
				.catch((e) => {
					reject(e);
				});
		});

	const createGroup = (
		groupName,
		quizTitle,
		quizSlug,
		quizData,
		groupId = false
	) =>
		new Promise((resolve, reject) => {
			if (!user) {
				reject('Please login');
			}
			const { uid } = user;
			const date = getTodaysDate();

			const newGroupId =
				false === groupId ? stringIdGenerator(5) : groupId;

			const groupPayload = {
				name: groupName,
				created: date,
				owner: uid,
				parent: quizTitle,
				results: quizData,
				total_entries: 0,
				total_score: 0,
				quizSlug,
			};

			// Create new group
			firebaseDatabase
				.ref(`groups/${newGroupId}`)
				.update(groupPayload)
				.then(() => {
					// Add new group to user record
					DfirebaseDatabase.ref(`users/${uid}/groups/${newGroupId}`)
						.update({
							name: groupName,
							created: date,
							total: 0,
							quizSlug,
							version: false !== groupId ? 2 : 1,
						})
						.then(() => {
							// Resolve promise request
							resolve({ groupId: newGroupId });
						})
						.catch((e) => {
							reject(e);
						});
				})
				.catch((e) => {
					reject(e);
				});
		});

	// Subscribe to user on mount
	// Because this sets state in the callback it will cause any ...
	// ... component that utilizes this hook to re-render with the ...
	// ... latest auth object.

	// BW: I can't figure out what this is actually supposed to do, and it's erroring out.
	// works without it

	// useEffect(() => {
	// 	const unsubscribe = firebaseAuth.onAuthStateChanged((u) => {
	// 		console.log('Auth State Change::', u);
	// 		if (u) {
	// 			setUser(u);
	// 		} else {
	// 			setUser(false);
	// 		}
	// 	});

	// 	// Cleanup subscription on unmount
	// 	return () => unsubscribe();
	// }, []);

	// Return the user object and auth methods
	return {
		user,
		signin,
		signinWithToken,
		signup,
		signout,
		sendPasswordResetEmail,
		confirmPasswordReset,
		verifyPasswordResetToken,
		getUserData,
		logDatasetDownload,
		atpConsent,
		deleteUser,
		updatePassword,
		logGroupToUser,
		createGroup,
		getGroup,
	};
};

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
function ProvideAuth({ children }) {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
const useAuth = () => useContext(authContext);

export { ProvideAuth, useAuth };
export default ProvideAuth;
