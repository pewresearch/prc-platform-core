/**
 * External Dependencies
 */
import { WPEntitySearch } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { Button, ToggleControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { TAXONOMY, TAXONOMY_LABEL } from './constants';

export default function PlaceholderBlockAreaSelect({ setBlockAreaSlug, context, value }) {
	return (
		<div>
			<WPEntitySearch
				placeholder={__('News Habits & Media Topic Lede...')}
				searchLabel={__(`Search for ${TAXONOMY_LABEL}`)}
				entityType="taxonomy"
				entitySubType={TAXONOMY}
				onSelect={(entity) => {
					console.log('Block Area Entity: ', entity);
					setBlockAreaSlug(entity.slug);
				}}
				onKeyEnter={() => {
					console.log("Enter Key Pressed");
				}}
				onKeyESC={() => {
					console.log("ESC Key Pressed");
				}}
				perPage={10}
				showExcerpt={true}
			/>
		</div>
	);
}
