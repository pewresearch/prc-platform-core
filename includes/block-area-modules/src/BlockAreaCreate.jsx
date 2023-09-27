/**
 * External Dependencies
 */
import { useDebounce } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';
import { Button, TextControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';
import { cleanForSlug } from '@wordpress/url';

/**
 * Internal Dependencies
 */
import { TAXONOMY, TAXONOMY_LABEL, POST_TYPE_LABEL } from './constants';

export async function createBlockArea(blockAreaName) {
	const {saveEntityRecord} = dispatch(coreStore);
	const slug = cleanForSlug(blockAreaName);

	const newBlockArea = await saveEntityRecord(
		'taxonomy',
		TAXONOMY,
		{
			name: blockAreaName,
			slug,
		}
	);
	if ( newBlockArea ) {
		console.log('createBlockArea ->', newBlockArea);
		return newBlockArea?.slug;
	}

	return false;
}

export default function BlockAreaCreate({ blockAreaName, onCreation = () => {} }){
	const [newBlockAreaName, setNewBlockAreaName] = useState(blockAreaName);
	const debouncedNewBlockAreaName = useDebounce(newBlockAreaName, 500);
	const allowCreation = useMemo(() => debouncedNewBlockAreaName && debouncedNewBlockAreaName.length > 3, [debouncedNewBlockAreaName]);

	return (
		<div>
			<TextControl
				label={__(`New ${TAXONOMY_LABEL} Name`)}
				value={ newBlockAreaName ? newBlockAreaName : '' }
				onChange={ ( value ) => setNewBlockAreaName( value ) }
			/>
			{!blockAreaName && (
				<Button
					variant="primary"
					onClick={() => {
						onCreation(debouncedNewBlockAreaName);
					}}
					disabled={!allowCreation}
				>
					{__(`Create New ${TAXONOMY_LABEL}`, 'prc-platform-core')}
				</Button>
			)}
		</div>
	);
}
