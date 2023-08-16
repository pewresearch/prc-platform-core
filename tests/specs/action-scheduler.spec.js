/**
 * WordPress Dependencies
 */
import { Admin, test, expect } from '@wordpress/e2e-test-utils-playwright';

// 1. We need to ensure that action schedule is working properly, it's usable,
// 2. we can create an action, we can check the action, we can delete the action, the action runs successfully.

test.describe( 'Action Scheduler', () => {
	test( 'Admin Works', async ( { admin, page } ) => {
		await admin.visitAdminPage('tools.php?page=action-scheduler');
		const pending = await page.textContent('li.pending');
		expect( pending ).toContain( 'Pending' );
	} );
} );
