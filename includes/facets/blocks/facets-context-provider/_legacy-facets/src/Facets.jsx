/**
 * WordPress Dependencies
 */
import { Fragment, useEffect, useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useFacets } from './context';
import { GroupAdvanced, GroupDateTime, GroupTaxonomies } from './groups';
import { UpdateButton } from './buttons';

function Facets() {
	const { ref, isMobile, postType } = useFacets();
	const [isOpen, toggleIsOpen] = useState(true);

	useEffect(() => {
		// When we get to mobile because open is default we want to close it.
		if (isOpen && isMobile) {
			toggleIsOpen(false);
		}
		const heading = ref.current.querySelector('h3.is-style-sub-header');
		heading.style.display = isMobile ? 'none' : 'block';
	}, [isMobile]);

	return (
		<Fragment>
			<UpdateButton
				isOpen={isOpen}
				expandOnClick={() => toggleIsOpen(!isOpen)}
			/>
			{isOpen && (
				<Fragment>
					<GroupDateTime />
					<GroupTaxonomies />
					<GroupAdvanced />
					<UpdateButton last />
				</Fragment>
			)}
		</Fragment>
	);
}

export default Facets;
