/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal Dependencies
 */
import MaelstromPanel from './maelstrom';
import StaffInfoPanel from './staff-info';

registerPlugin('prc-staff-info', {
	render: () => {
		return (
			<Fragment>
				<StaffInfoPanel />
				<MaelstromPanel />
			</Fragment>
		);
	},
	icon: null,
});
