// Test that we can save art direction to a new post, that data is correctly saved to the db, and that it is correctly retrieved from the db when using helpers.

/**
 * WordPress Dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Art Direction', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'can add art and save it to a post', async ( {
		editor,
		page,
	} ) => {
		// Find the art direction panel and click on the A1 tag, set an image, and watch...
	} );
} );
