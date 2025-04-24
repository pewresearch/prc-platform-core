/**
 * WordPress Dependencies
 */
import { FormToggle } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import { PluginPostStatusInfo } from '@wordpress/editor';

function PRCPostVisibility() {
	const { editPost } = useDispatch('core/editor');
	const [isHiddenOnIndex, setIsHiddenOnIndex] = useState(false);
	const [isHiddenOnSearch, setIsHiddenOnSearch] = useState(false);

	const {
		selectedPostVisibilityTerms,
		hiddenOnIndexTermId,
		hiddenOnSearchTermId,
	} = useSelect((select) => {
		const _selectedPostVisibilityTermIds =
			select('core/editor').getEditedPostAttribute('_post_visibility') ??
			[];
		const postVisibilityTerms =
			select('core').getEntityRecords('taxonomy', '_post_visibility') ??
			[];

		// Find the term IDs for our visibility terms
		const hiddenOnIndexTerm = postVisibilityTerms.find(
			(term) => term.slug === 'hidden-on-index'
		);
		const hiddenOnSearchTerm = postVisibilityTerms.find(
			(term) => term.slug === 'hidden-on-search'
		);

		return {
			postVisibilityTerms,
			selectedPostVisibilityTerms: _selectedPostVisibilityTermIds,
			hiddenOnIndexTermId: hiddenOnIndexTerm?.id,
			hiddenOnSearchTermId: hiddenOnSearchTerm?.id,
		};
	}, []);

	// Update local state when selected terms change
	useEffect(() => {
		if (selectedPostVisibilityTerms) {
			setIsHiddenOnIndex(
				selectedPostVisibilityTerms.includes(hiddenOnIndexTermId)
			);
			setIsHiddenOnSearch(
				selectedPostVisibilityTerms.includes(hiddenOnSearchTermId)
			);
		}
	}, [
		selectedPostVisibilityTerms,
		hiddenOnIndexTermId,
		hiddenOnSearchTermId,
	]);

	const handleVisibilityToggle = (termId, isChecked) => {
		let newTerms = [...(selectedPostVisibilityTerms || [])];

		if (isChecked) {
			if (!newTerms.includes(termId)) {
				newTerms.push(termId);
			}
		} else {
			newTerms = newTerms.filter((id) => id !== termId);
		}

		editPost({ _post_visibility: newTerms });
	};

	return (
		<>
			<PluginPostStatusInfo>
				<label htmlFor="hide-on-index-toggle">
					Hide On /publications
				</label>
				<FormToggle
					id="hide-on-index-toggle"
					checked={isHiddenOnIndex}
					onChange={() =>
						handleVisibilityToggle(
							hiddenOnIndexTermId,
							!isHiddenOnIndex
						)
					}
				/>
			</PluginPostStatusInfo>
			<PluginPostStatusInfo>
				<label htmlFor="hide-on-search-toggle">Hide On /search</label>
				<FormToggle
					id="hide-on-search-toggle"
					checked={isHiddenOnSearch}
					onChange={() =>
						handleVisibilityToggle(
							hiddenOnSearchTermId,
							!isHiddenOnSearch
						)
					}
				/>
			</PluginPostStatusInfo>
		</>
	);
}

registerPlugin('prc-post-visibility', { render: PRCPostVisibility });
