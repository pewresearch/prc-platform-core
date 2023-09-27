/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

export default function PlaceholderWizardSummary({
	newBlockAreaName = null,
	blockAreaSlug = null,
	categorySlug = null,
	inheritCategory = false,
}) {
	return (
		<Fragment>
			<p>
				<strong>New Block Area Name:</strong> {newBlockAreaName}
			</p>
			<p>
				<strong>Block Area Slug:</strong> {blockAreaSlug}
			</p>
			<p>
				<strong>Category Slug:</strong> {categorySlug}
			</p>
			<p>
				<strong>Inherit Category:</strong> {inheritCategory ? 'Yes' : 'No'}
			</p>
		</Fragment>
	)
}
