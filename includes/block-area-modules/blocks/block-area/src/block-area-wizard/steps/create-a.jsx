/**
 * External Dependencies
 */
import { EntityCreateNewModal } from '@prc/components';

/**
 * Internal Dependencies
 */
import { createBlockModule } from '../../functions';

export default function CreateA({
	defaultTitle = 'Block Module',
	blockAreaId,
	categoryId,
	onCreate = () => {},
	setNextStep,
}) {
	return (
		<EntityCreateNewModal
			{...{
				defaultTitle,
				onClose: () => {
					setNextStep('intro');
				},
				onSubmit: (newTitle) => {
					createBlockModule(
						newTitle,
						blockAreaId,
						categoryId,
						'publish'
					).then((response) => {
						console.log('then...', response);
						onCreate(response.id);
					});
				},
			}}
		/>
	);
}
