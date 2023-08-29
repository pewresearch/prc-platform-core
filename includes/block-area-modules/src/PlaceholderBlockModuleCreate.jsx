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
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { POST_TYPE, POST_TYPE_LABEL } from './constants';

export default function PlaceholderBlockAreaCreate({ setBlockAreaName, context }) {
	const [newBlockAreaName, setNewBlockAreaName] = useState('');
	const debouncedNewBlockAreaName = useDebounce(newBlockAreaName, 500);

	// New entity provider that we can use to create a new POST_TYPE but assign it the block area and category. It'll give us an id, once we have an id we'll know it's created and continue.

	// FOr the block module we should offer some patterns just for this post type that includes things like Grid Lede arrangements.

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
