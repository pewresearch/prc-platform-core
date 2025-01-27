/**
 * WordPress Dependencies
 */
import { addFilter, doAction } from '@wordpress/hooks';
import { select, dispatch, register, createReduxStore } from '@wordpress/data';

const NAMESPACE = 'prc-platform/post-publish-pipeline';

const DEFAULT_STATE = {
	postStatus: null,
};

const actions = {
	setPostStatus( postStatus ) {
		return {
			type: 'SET_POST_STATUS',
			postStatus,
		};
	},
};

const reducer = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'SET_POST_STATUS':
			return {
				...state,
				postStatus: action.postStatus,
			};
		default:
			return state;
	}
};

const selectors = {
	getPostStatus( state ) {
		return state.postStatus;
	},
};

const store = createReduxStore( NAMESPACE, {
	reducer,
	actions,
	selectors,
} );

register( store );

addFilter('editor.preSavePost', 'editor', (edits) => {
	const priorStatus = select(NAMESPACE).getPostStatus();
	const postStatus = select( 'core/editor' ).getEditedPostAttribute( 'status' );
	const postId = select( 'core/editor' ).getCurrentPostId();
	const postType = select( 'core/editor' ).getCurrentPostType();
	const isSiteEditor = select( 'core/edit-site' )?.getEditorMode() || false;

	if ( isSiteEditor ) {
		console.log('prc-platform.onSiteEdit', {edits, postId, postType, postStatus});
		doAction('prc-platform.onSiteEdit', {edits, postId, postType, postStatus});
		return edits;
	}

	if ( null === priorStatus && 'auto-draft' === postStatus ) {
		console.log('prc-platform.onPostInit', {edits, postId, postType, postStatus});
		doAction('prc-platform.onPostInit', {edits, postId, postType, isSiteEditor});
	}

	if ( ('draft' === priorStatus || null === priorStatus) && 'draft' === postStatus ) {
		console.log('prc-platform.onIncrementalSave', {edits, postId, postType, postStatus})
		doAction('prc-platform.onIncrementalSave', {edits, postId, postType, isSiteEditor});
	}

	if ( 'draft' === priorStatus && 'publish' === postStatus ) {
		console.log('prc-platform.onPublish', {edits, postId, postType, postStatus});
		doAction('prc-platform.onPublish', {edits, postId, postType, isSiteEditor});
	}

	if ( ('publish' === priorStatus || null === priorStatus) && 'publish' === postStatus ) {
		console.log('prc-platform.onUpdate', {edits, postId, postType, postStatus});
		doAction('prc-platform.onUpdate', {edits, postId, postType, isSiteEditor});
	}

	if ( 'publish' === priorStatus && 'draft' === postStatus ) {
		console.log('prc-platform.onUnpublish', {edits, postId, postType, postStatus});
		doAction('prc-platform.onUnpublish', {edits, postId, postType, isSiteEditor});
	}

	dispatch(NAMESPACE).setPostStatus(postStatus);

	return edits;
});
