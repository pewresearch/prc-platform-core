/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { TypeMultiple, TypeSingle } from '../types';

function GroupTaxonomies() {
	return (
		<Fragment>
			<TypeMultiple facetName="formats" />
			<TypeSingle facetName="regions_countries" />
			<TypeMultiple facetName="topic" />
		</Fragment>
	);
}

export default GroupTaxonomies;
