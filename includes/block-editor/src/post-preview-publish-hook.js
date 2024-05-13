/**
 * WordPress Dependencies
 */
import { select, subscribe } from '@wordpress/data';

/**
 * Internal Dependencies
 */
// Actions:
import regenerateToc from './regenerate-toc-action';

const actions = {
	post: {
		preview: {
			start: [regenerateToc],
			end: [],
		},
		publish: {
			start: [regenerateToc],
			end: [],
		},
	},
	'fact-sheet': {
		preview: {
			start: [regenerateToc],
			end: [],
		},
		publish: {
			start: [regenerateToc],
			end: [],
		},
	},
};

function startPreview(postId, postType) {
	if (
		actions[postType].preview.start &&
		actions[postType].preview.start.length
	) {
		actions[postType].preview.start.forEach((action) => {
			action(postId);
		});
	}
}

function endPreview(postId, postType) {
	if (actions[postType].preview.end && actions[postType].preview.end.length) {
		actions[postType].preview.end.forEach((action) => {
			action(postId);
		});
	}
}

function startPublish(postId, postType) {
	if (
		actions[postType].publish.start &&
		actions[postType].publish.start.length
	) {
		actions[postType].publish.start.forEach((action) => {
			action(postId);
		});
	}
}

function endPublish(postId, postType) {
	if (actions[postType].publish.end && actions[postType].publish.end.length) {
		actions[postType].publish.end.forEach((action) => {
			action(postId);
		});
	}
}

function watcher() {
	console.log("prc-platform/post-preview-publish-hook: watcher activating");
	// Setup simple functions to get the current status of the post:
	const getPostPreviewStatus = () => select('core/editor').isPreviewingPost();
	const getPostPublishStatus = () => select('core/editor').isPublishingPost();
	const getPostAutosaveStatus = () =>
		select('core/editor').isAutosavingPost();

	// Set initial values to compare against:
	let previewStatus = getPostPreviewStatus();
	let publishStatus = getPostPublishStatus();
	let autosaveStatus = getPostAutosaveStatus();

	subscribe(() => {
		// Get current values:
		const postId = select('core/editor').getCurrentPostId();
		const postType = select('core/editor').getCurrentPostType();
		const newPostPreviewStatus = getPostPreviewStatus();
		const newPostPublishStatus = getPostPublishStatus();
		const newPostAutosaveStatus = getPostAutosaveStatus();

		if (previewStatus !== newPostPreviewStatus) {
			console.log('start preview', postId, postType);
			startPreview(postId, postType);
		}
		if (publishStatus !== newPostPublishStatus) {
			console.log('start publish', postId, postType);
			startPublish(postId, postType);
		}
		if (autosaveStatus !== newPostAutosaveStatus) {
			console.log('autosave', postId, postType);
		}
		if (previewStatus && !newPostPreviewStatus) {
			console.log('end preview', postId, postType);
			endPreview(postId, postType);
		}
		if (publishStatus && !newPostPublishStatus) {
			console.log('end publish', postId, postType);
			endPublish(postId, postType);
		}

		// Store new values back:
		previewStatus = newPostPreviewStatus;
		publishStatus = newPostPublishStatus;
		autosaveStatus = newPostAutosaveStatus;
	});
}

export default function postPreviewPublishHook() {
	watcher();
}
