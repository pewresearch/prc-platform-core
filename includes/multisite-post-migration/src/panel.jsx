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
	const { postId, postType } = useSelect(
		(select) => ({
			postId: select('core/editor').getCurrentPostId(),
			postType: select('core/editor').getCurrentPostType(),
		}),
		[]
	);

	const [originalSiteId, setOriginalSiteId] = useState(null);
	const [originalPostId, setOriginalPostId] = useState(null);
	const [originalParentId, setOriginalParentId] = useState(null);
	const [originalPostLink, setOriginalPostLink] = useState(null);

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
						originalPostAttachments,
					} = response;
					setOriginalSiteId(originalSiteId);
					setOriginalPostId(originalPostId);
					setOriginalPostLink(originalPostLink);
					setOriginalParentId(originalParentId);
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
			icon={() => `🚀`}
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
					<p>
						<strong>Legacy Site ID: </strong>
						{originalSiteId}
					</p>
					<p>
						<strong>Legacy Post ID: </strong>
						{originalPostId}
					</p>
					<p>
						<ExternalLink
							href={`${originalPostLink}`}
							target="_blank"
						>
							{__('Inspect Legacy Post')}
						</ExternalLink>
					</p>
				</PanelContent>
			</PanelBody>
			<PanelBody title={__('Topic Category Tool')} initialOpen>
				<p>Topic Category Tool Will Go Here</p>
				<p>
					We will fetch the topics from the stub of the legacy post,
					this is the most truthful set of data.
				</p>
				<p>
					Get the topic taxonomy term slugs from the stubs, find the
					term ids for those slugs here, display modal to review,
					click to apply
				</p>
			</PanelBody>
		</PluginSidebar>
	);
};

export default withNotices(MigrationPanel);
