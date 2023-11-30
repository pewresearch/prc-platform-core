/**
 * External Dependencies
 */
import { EntityCreateNewModal } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { createBlockModule } from '../../functions';

export default function CreateA( {
	defaultTitle = 'Block Module',
	blockAreaId,
	categoryId,
	onCreate = () => {},
	setNextStep,
} ) {
	return(
		<Fragment>
			<EntityCreateNewModal {...{
				defaultTitle,
				onClose: () => {
					setNextStep('intro');
				},
				onSubmit: (newTitle) => {
					createBlockModule(newTitle, blockAreaId, categoryId, 'publish').then((response) => {
						console.log("then...", response);
						onCreate(response.id);
					});
				},
			}}/>
		</Fragment>
	);
}
