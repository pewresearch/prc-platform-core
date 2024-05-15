/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-lines-per-function */
/**
 * External Dependencies
 */
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect, useState } from '@wordpress/element';
import {
	Animate,
	BaseControl,
	ExternalLink,
	withFilters,
	withNotices,
	PanelBody,
	Spinner,
	Button,
	ToggleControl,
} from '@wordpress/components';
import { PluginSidebar } from '@wordpress/edit-post';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as noticeStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal Dependencies
 */

const PanelContent = styled.div`
	display: block;
`;

const MigrationPanel = ({ noticeOperations, noticeUI, noticeList }) => {
	const { postId, postType, postMeta } = useSelect(
		(select) => ({
			postId: select('core/editor').getCurrentPostId(),
			postType: select('core/editor').getCurrentPostType(),
			postMeta: select('core/editor').getEditedPostAttribute('meta'),
		}),
		[]
	);

	const { editPost } = useDispatch('core/editor');

	const [originalSiteId, setOriginalSiteId] = useState(null);
	const [originalPostId, setOriginalPostId] = useState(null);
	const [originalPostLink, setOriginalPostLink] = useState(null);
	const [stubPostId, setStubPostId] = useState(null);
	const [taxonomies, setTaxonomies] = useState(null);

	useEffect(() => {
		if (postId) {
			apiFetch({
				path: `/prc-api/v3/migration-tools/info/?postId=${postId}`,
			})
				.then((response) => {
					const {
						originalSiteId,
						originalPostId,
						originalPostLink,
						originalParentId,
						stubPostId,
					} = response;
					setOriginalSiteId(originalSiteId);
					setOriginalPostId(originalPostId);
					setOriginalPostLink(originalPostLink);
					setStubPostId(stubPostId);
					setTaxonomies(response.taxonomies);
					console.log('MIGRATION INFO:::', response);
				})
				.catch((error) => {
					console.log('MIGRATION ERROR::', error);
				});
		}
	}, [postId, postType]);

	return (
		<PluginSidebar
			name="prc-platform-migration-panel"
			title="PRC Platform Migration"
		>
			<PanelBody
				title={__('Migration Info')}
				initialOpen
				className="prc-stub-panel--info"
			>
				<PanelContent>
					<p>
						<strong>Post ID: </strong>
						{postId}
					</p>
					{originalSiteId && (
						<Fragment>
							<p>
								<strong>Legacy Site ID: </strong>
								{originalSiteId}
							</p>
							<p>
								<strong>Legacy Post ID: </strong>
								{originalPostId}
							</p>
							<p>
								<strong>Legacy Stub ID: </strong>
								{stubPostId}
							</p>
							<p>
								<ExternalLink
									href={`${originalPostLink}`}
									target="_blank"
								>
									{__('Inspect Legacy Post')}
								</ExternalLink>
							</p>
						</Fragment>
					)}
				</PanelContent>
			</PanelBody>
			{taxonomies && (
				<PanelBody
					title={__('Taxonomy Restoration')}
					initialOpen={false}
				>
					<BaseControl
						id="taxonomy-restoration"
						help={__(
							'This functionality will pull the taxonomy terms for this post from legacy.pewresearch.org and apply them to this post. This will overwrite any existing terms on the post when you save.'
						)}
					>
						{Object.entries(taxonomies).map(([taxonomy, data]) => (
							<Button
								key={taxonomy}
								variant="secondary"
								onClick={() => {
									const primaryTermName =
										data.primary_term_name;
									console.log(
										'PRIMARY TERM:::',
										primaryTermName
									);
									const termIds = data.terms.map(
										(b) => b.term_id
									);

									console.log(
										`RESTORE ${taxonomy.toUpperCase()}:::`,
										termIds
									);
									editPost({
										[taxonomy]: termIds,
									});
									alert(
										`The primary term for this post is: ${primaryTermName}`
									);
								}}
							>
								Restore {taxonomy.toUpperCase()} Terms
							</Button>
						))}
					</BaseControl>
				</PanelBody>
			)}
		</PluginSidebar>
	);
};

export default withNotices(MigrationPanel);