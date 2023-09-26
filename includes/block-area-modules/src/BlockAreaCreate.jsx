/**
 * External Dependencies
 */
import { useDebounce } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { Placeholder, Button, TextControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { cleanForSlug } from '@wordpress/url';

/**
 * Internal Dependencies
 */
import { TAXONOMY, TAXONOMY_LABEL } from './constants';

export default function BlockAreaCreate({ blockAreaName, onCreation = () => {} }){
	const {saveEntityRecord} = useDispatch(coreStore);
	const [allowCreation, setAllowCreation] = useState(false);
	const [newBlockAreaName, setNewBlockAreaName] = useState(blockAreaName);
	const debouncedNewBlockAreaName = useDebounce(newBlockAreaName, 500);

	useEffect(() => {
		if (debouncedNewBlockAreaName && debouncedNewBlockAreaName.length > 3) {
			setAllowCreation(true);
		}
	}, [debouncedNewBlockAreaName]);

	const onCreate = async () => {
		if ( ! allowCreation ) {
			return false;
		}

		const slug = cleanForSlug(debouncedNewBlockAreaName);

		const newBlockArea = await saveEntityRecord(
			'taxonomy',
			TAXONOMY,
			{
				name: debouncedNewBlockAreaName,
				slug,
			}
		);
		if ( newBlockArea ) {
			// Reset the values:
			setNewBlockAreaName('');
			console.log('onCreateNewBlockArea', newBlockArea);
			return newBlockArea?.slug;
		}

		return false;
	}

	return (
		<Placeholder
			label={__('Block Area Create', 'prc-platform-core')}
			instructions={__(`"Block Areas" are used to create areas where Block Modules can render content based on criteria like Topic.`)}
			isColumnLayout={true}
		>
			<TextControl
				label={__(`New ${TAXONOMY_LABEL} Name`)}
				help={__(`Enter a name for the new ${TAXONOMY_LABEL}`)}
				value={ newBlockAreaName }
				onChange={ ( value ) => setNewBlockAreaName( value ) }
			/>
			<Button
				variant="primary"
				onClick={() => onCreate().then((resp) => onCreation(resp).catch((err) => console.error(err)))}
				disabled={!allowCreation}
			>
				{__(`Create New ${TAXONOMY_LABEL}`, 'prc-platform-core')}
			</Button>
		</Placeholder>
	);
}
