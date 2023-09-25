/**
 * External Dependencies
 */
import { useDebounce } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { Button, TextControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { TAXONOMY, TAXONOMY_LABEL } from './constants';

export default function PlaceholderBlockAreaCreate({ setBlockAreaName, context }) {
	const [newBlockAreaName, setNewBlockAreaName] = useState('');
	const debouncedNewBlockAreaName = useDebounce(newBlockAreaName, 500);

	useEffect(() => {
		if (debouncedNewBlockAreaName && debouncedNewBlockAreaName.length > 3) {
			setBlockAreaName(debouncedNewBlockAreaName);
		}
	}, [debouncedNewBlockAreaName]);

	return (
		<div>
			<TextControl
				label={__('New Block Area Name')}
				help={__('Enter a name for the new Block Area')}
				value={ newBlockAreaName }
				onChange={ ( value ) => setNewBlockAreaName( value ) }
			/>
		</div>
	);
}
