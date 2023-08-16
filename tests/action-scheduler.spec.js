/**
 * WordPress Dependencies
 */
import { Admin, test, expect } from '@wordpress/e2e-test-utils-playwright';

// 1. We need to ensure that action schedule is working properly, it's usable,
// 2. we can create an action, we can check the action, we can delete the action, the action runs successfully.

test.use({
	admin: async ( { page, pageUtils } ) => {
		return new Admin( page, pageUtils );
	}
});

test.describe( 'Action Scheduler', () => {

	test( 'Action Scheduler is working properly', async () => {
		await admin.visitAdminPage( 'tools.php?page=action-scheduler' );
		const clickable = await admin.page.click( 'text=Pending' );
		expect(clickable).toBe(true);
	} );

} );
