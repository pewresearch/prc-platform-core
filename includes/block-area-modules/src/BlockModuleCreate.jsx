/**
 * External Dependencies
 */
import { useDebounce } from '@prc/hooks';
import { symbolFilled as icon } from '@wordpress/icons';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';
import { Button, TextControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';


/**
 * Internal Dependencies
 */
import { POST_TYPE, POST_TYPE_LABEL, TAXONOMY, TAXONOMY_REST_BASE } from './constants';

export async function createBlockModule(blockModuleTitle, blockAreaId, categoryId, status = 'publish') {
	if ( !blockAreaId ) {
		return new Error('No block area id provided.');
	}
	if ( !categoryId ) {
		return new Error('No category id provided.');
	}

	const { saveEntityRecord } = dispatch(coreStore);

	const newBlockModule = await saveEntityRecord(
		'postType',
		POST_TYPE,
		{
			title: blockModuleTitle,
			status,
			categories: [categoryId],
			[TAXONOMY_REST_BASE]: [blockAreaId],
		}
	);

	if ( newBlockModule ) {
		console.log('onCreateBlockModule', newBlockModule);
		return newBlockModule;
	}

	return false;
}

/**
 * A simple components that allows a user to create a new Block Module post.
 * @param {*} param0
 * @returns
 */
export default function BlockModuleCreate({blockAreaId, categoryId}) {
	const [newBlockModuleTitle, setNewBlockModuleTitle] = useState('');
	const debouncedNewBlockModuleTitle = useDebounce(newBlockModuleTitle, 500);
	const allowCreation = useMemo(() => debouncedNewBlockModuleTitle && debouncedNewBlockModuleTitle.length > 3, [debouncedNewBlockModuleTitle]);

	return (
		<div>
			<TextControl
				label={__(`New ${POST_TYPE_LABEL} Title`, 'prc-platform-core')}
				value={ newBlockModuleTitle }
				onChange={ ( newTitle ) => {
					setNewBlockModuleTitle( newTitle );
				} }
			/>
			<Button
				variant="primary"
				onClick={() => createBlockModule(debouncedNewBlockModuleTitle, blockAreaId, categoryId)}
				disabled={!allowCreation}
			>
				{__(`Create New ${POST_TYPE_LABEL}`, 'prc-platform-core')}
			</Button>
		</div>
	);
}
