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

const MigrationTool = ({title, label = "Run Report Package Verificaiton", tool = 'report-package-verification', postId}) => {
	const [displayAllowOverwrite, setDisplayAllowOverwrite] = useState(false);
	const [allowDryRun, setAllowDryRun] = useState(true);
	const [allowOverwrite, setAllowOverwrite] = useState(false);
	const { createSuccessNotice, createErrorNotice } = useDispatch(noticeStore);

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
					createSuccessNotice(
						`Verification Successful`,
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
			noticeOperations.createErrorNotice( error.message );
			if ( 'existing-data' === error.code ) {
				setDisplayAllowOverwrite(true);
			}
		});
	};

	return(
		<PanelBody title={title}>
			<PanelContent>
				<ToggleControl
					label="Dry Run"
					checked={allowDryRun}
					onChange={setAllowDryRun}
				/>
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

			{hasSupports && hasSupports.reportPackageConnection && (
				<MigrationTool title="Report Package Verification" postId={postId} />
			)}
			{hasSupports && hasSupports.attachments && (
				<MigrationTool title="Attachments Verification" label="Run Attachments Verification" tool="attachments" postId={postId} />
			)}
		</PluginSidebar>
	);
};

export default withNotices(MigrationPanel);
