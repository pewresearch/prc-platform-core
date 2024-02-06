/**
 * External Dependencies
 */
import { Icon, download as icon } from '@wordpress/icons';
import { MediaDropZone } from '@prc/components';



/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useMemo } from 'react';
import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar, PluginPrePublishPanel } from '@wordpress/edit-post';
import { store as editorStore } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { Button, CardDivider, PanelBody, TextareaControl, ToggleControl } from '@wordpress/components';

/**
 * Internal Dependencies
 */

const PLUGIN_NAME = 'prc-platform-datasets-panel';
const ALLOWED_TYPES = [
	'application/zip',
	'application/pdf',
];

function DatasetOptionsPanel() {
	const { postType, postId } = useSelect(
		(select) => {
			const currentPostType = select(editorStore).getCurrentPostType();
			const currentPostId = select(editorStore).getCurrentPostId();
			return {
				postType: currentPostType,
				postId: currentPostId,
			}
		},
		[]
	);

	const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta', postId );

	const {attachmentId, isAtp, datasetSchema} = useMemo( () => {
		console.log("meta", meta);
		return {
			attachmentId: meta[ '_download_attachment_id' ] || false,
			isAtp: meta[ 'is_atp' ] || false,
			datasetSchema: meta[ 'dataset_schema' ] || '',
		}
	}, [ meta ] );

	return (
		<Fragment>
			<PluginSidebar name={PLUGIN_NAME} title="Dataset Options" icon={<Icon icon={icon} size={16} />}>
				<PanelBody title="Dataset File">
					<MediaDropZone {...{
						attachmentId,
						disabled: false,
						onUpdate: (attachment) => {
							setMeta( {
								...meta,
								_download_attachment_id: attachment.id,
							} );
						},
						editButtonLabel: __('Edit Dataset File'),
						onClear: false,
						allowedTypes: ALLOWED_TYPES,
						label: __('Upload Dataset File (zip or pdf)'),
						singularLabel: __('dataset'),
					}}/>
					<CardDivider />
					<ToggleControl
						label="ATP Dataset"
						help="ATP datasets are bound by an opt-in to the ATP Terms of Service."
						checked={isAtp}
						onChange={(value) => {
							setMeta( {
								...meta,
								is_atp: value,
							} );
						}}
					/>
				</PanelBody>
				<PanelBody title="Dataset Schema">
					<TextareaControl
						label="Dataset Schema"
						value={datasetSchema}
						onChange={(value) => {
							setMeta( {
								...meta,
								dataset_schema: value,
							} );
						}}
					/>
				</PanelBody>
				{/* @TODO: WIP, Eventually I'd like to get all entities that reference this dataset, but we'll wait for the Supra-Block-Data-Store <PanelBody title="Dataset Posts">
					<p>A list of posts that are calling this dataset...</p>
				</PanelBody> */}
			</PluginSidebar>
			<PluginPrePublishPanel>
				<PanelBody title="Review Dataset Options">
					<MediaDropZone {...{
						attachmentId,
						disabled: false,
						onUpdate: (attachment) => {
							setMeta( {
								...meta,
								_download_attachment_id: attachment.id,
							} );
						},
						editButtonLabel: __('Edit Dataset File'),
						onClear: false,
						allowedTypes: ALLOWED_TYPES,
						label: __('Upload Dataset File (zip or pdf)'),
						singularLabel: __('dataset'),
					}}/>
					<CardDivider />
					<ToggleControl
						label="ATP Dataset"
						help="ATP datasets are bound by an opt-in to the ATP Terms of Service."
						checked={isAtp}
						onChange={(value) => {
							setMeta( {
								...meta,
								is_atp: value,
							} );
						}}
					/>
				</PanelBody>
			</PluginPrePublishPanel>
		</Fragment>
	);
}

registerPlugin(PLUGIN_NAME, {
	render: DatasetOptionsPanel,
});
