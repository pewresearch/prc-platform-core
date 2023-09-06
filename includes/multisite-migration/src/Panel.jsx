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

const MigrationTool = ({title, label, tool, postId, warning, displayDryRun = true}) => {
	const [displayAllowOverwrite, setDisplayAllowOverwrite] = useState(false);
	const [allowDryRun, setAllowDryRun] = useState(true);
	const [allowOverwrite, setAllowOverwrite] = useState(false);
	const { createSuccessNotice, createErrorNotice } = useDispatch(noticeStore);
	const { editPost } = useDispatch('core/editor');
	const {currentPost} = useSelect( select => {
		return {
			currentPost: select('core/editor').getCurrentPost(),
		};
	});

	const runTool = () => {
		apiFetch({
			path: addQueryArgs(`/prc-api/v3/migration/verify/${tool}/`, {
				postId: postId,
				allowOverwrite: allowOverwrite,
				dryRun: allowDryRun,
			}),
		}).then((response) => {
			console.log("RESPONSE:", response);
			if ( false !== response ) {
				setDisplayAllowOverwrite(true);
				if ( allowOverwrite ) {
					let msg = `Verification Successful`;
					// use entity prop to set the new categories from the response ids...
					if ( 'topic-categories' === tool && response?.newTerms?.length ) {
						editPost({ categories: response.newTerms });
						msg = `Verification Successful. Categories updated, check inspector for changes and click update to save.`;
					}

					createSuccessNotice(
						msg,
						{
							type: 'snackbar',
						}
					);
				} else {
					createSuccessNotice(
						`Verification Successful. Allow Overwrite to run the tool.`,
						{
							type: 'snackbar',
						}
					);
				}
			}
		}).catch((error) => {
			createErrorNotice(
				`Verification Failed`,
				{
					type: 'snackbar',
				}
			);
			console.error(error);
			createErrorNotice( error.message );
			if ( 'existing-data' === error.code ) {
				setDisplayAllowOverwrite(true);
			}
		});
	};

	return(
		<PanelBody title={title}>
			<PanelContent>
				<BaseControl help={warning ? warning : null}>
					{displayDryRun && <ToggleControl
						label="Dry Run"
						checked={allowDryRun}
						onChange={setAllowDryRun}
					/>}
					{displayAllowOverwrite && (
						<ToggleControl
							label="Allow Overwrite"
							checked={allowOverwrite}
							onChange={setAllowOverwrite}
						/>
					)}
					<Button
						variant="secondary"
						onClick={ () => runTool() }
					>
						{label}
					</Button>
				</BaseControl>
			</PanelContent>
		</PanelBody>
	);
}

const MigrationPanel = ({noticeOperations, noticeUI, noticeList}) => {
	const { postId, postType } = useSelect(
		(select) => ({
			postId: select('core/editor').getCurrentPostId(),
			postType: select('core/editor').getCurrentPostType(),
		}),
		[],
	);

	const [originalSiteId, setOriginalSiteId] = useState(null);
	const [originalPostId, setOriginalPostId] = useState(null);
	const [originalParentId, setOriginalParentId] = useState(null);
	const [hasSupports, setHasSupports] = useState(null);

	useEffect(() => {
		if (postId) {
			apiFetch({
				path: `/prc-api/v3/migration/info/?postId=${postId}`,
			}).then((response) => {
				const { postId, siteId, parentId, has } = response;
				setOriginalSiteId(siteId);
				setOriginalPostId(postId);
				setOriginalParentId(parentId);
				setHasSupports(has);
			}).catch((error) => {
				console.log("MIGRATION ERROR::", error);
			});
		}
	}, [postId, postType]);

	useEffect(() => {
		console.log('noticeList...', noticeList, hasSupports);
	}, [noticeList, hasSupports]);

	return (
		<PluginSidebar
			name="prc-platform-migration-panel"
			title="PRC Platform Migration"
			// icon={() => `✨`}
		>
			<PanelBody
				title={__('Migration Info')}
				initialOpen
				className="prc-stub-panel--info"
			>
				<PanelContent>
					<p><strong>Post ID: </strong>{postId}</p>
					<p><strong>Origin Site ID: </strong>{originalSiteId}</p>
					<p><strong>Origin Post ID: </strong>{originalPostId}</p>
					{originalParentId && <p><strong>Origin Parent ID: </strong>{originalParentId}</p>}
					<ExternalLink href={`${window.siteDomain}/wp-admin/post.php?post=${originalPostId}&action=edit`} target="_blank">
						{__('Inspect Origin Post')}
					</ExternalLink>
					{originalParentId && (
						<Fragment>
							<br />
							<ExternalLink href={`${window.siteDomain}/wp-admin/post.php?post=${originalParentId}&action=edit`} target="_blank">
								{__('Inspect Origin Parent Post')}
							</ExternalLink>
						</Fragment>
					)}
				</PanelContent>
			</PanelBody>
			{hasSupports && hasSupports.topicCategories && (
				<MigrationTool title="Topic Categories Verification" label="Run Topic Category Verification" tool="topic-categories" postId={postId} warning="Running this action will set the correct categories in the editor, check the inspector for new data." displayDryRun={false}/>
			)}
			{hasSupports && hasSupports.reportPackageConnection && (
				<MigrationTool title="Report Package Verification" label="Run Report Package Verification" tool="report-package-connection" postId={postId} warning="Running this action with dry run off will update the report package connection immediately." />
			)}
			{hasSupports && hasSupports.attachments && (
				<MigrationTool title="Attachments Verification" label="Run Art Direction Verification" tool="attachments" postId={postId} warning="Running this action with dry run off will do the following immediately: a.) re-copy over any attachments for this post from its origin. b.) update the art direction with the correct art direction items pointing to the new attachments." />
			)}
		</PluginSidebar>
	);
};

export default withNotices(MigrationPanel);
