/**
 * WordPress Dependencies
 */
import { Admin } from '@wordpress/e2e-test-utils-playwright';

// 1. We need to ensure that action schedule is working properly, it's usable,
// 2. we can create an action, we can check the action, we can delete the action, the action runs successfully.

describe('Action Scheduler Test:', () => {
	it('1. Is Action Scheduler Reachable?', async () => {
		const admin = new Admin( { page, pageUtils } );
		await admin.visitAdminPage( 'tools.php?page=action-scheduler' );
		const clickable = await admin.page.click( 'text=Pending' );
		expect(clickable).toBe(true);
	});

});
