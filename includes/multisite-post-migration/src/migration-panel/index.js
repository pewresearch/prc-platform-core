/**
 * WordPress Dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal Dependencies
 */
import MigrationPanel from './panel';

/**
 * Provides simple post migration tools for data cleanup
 */
registerPlugin('prc-platform-migration-panel', {
	render: () => <MigrationPanel />,
});
