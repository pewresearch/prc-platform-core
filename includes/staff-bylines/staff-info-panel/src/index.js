/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { BaseControl, CardDivider, ToggleControl, TextControl } from '@wordpress/components';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';

function StaffInfoPanel() {
	const { postType, postId } = useSelect(
		(select) => ({
			postType: select('core/editor').getCurrentPostType(),
			postId: select('core/editor').getCurrentPostId(),
		}),
		[],
	);

	const [meta, setMeta] = useEntityProp('postType', postType, 'meta', postId);
	const { jobTitle, jobTitleExtended, socialProfiles, bylineLinkEnabled } = meta;

	return (
		<PluginDocumentSettingPanel
			name="prc-staff-info"
			title="Staff Information"
		>
			<ToggleControl
				label={__('Display Byline Link')}
				help={__(
					'All staff are assigned a byline tem, however not all staff have a link to a byline archive "staff bio" page. If this staff member has a bio page, enable this option to link their byline to their bio page.'
				)}
				checked={bylineLinkEnabled}
				onChange={() => {
					setMeta({
						...meta,
						bylineLinkEnabled: !bylineLinkEnabled
					});
				}}
			/>
			<CardDivider />
			<TextControl
				label={__('Job Title')}
				value={jobTitle}
				onChange={(value) => {
					setMeta({ ...meta, jobTitle: value });
				}}
				placeholder="Research Assistant"
			/>
			{bylineLinkEnabled && (
				<Fragment>
					<TextControl
						label={__('Job Title Extended')}
						help={__('This extended job title appears under Short Read posts.')}
						value={jobTitleExtended}
						onChange={(value) => {
							setMeta({
								...meta,
								jobTitleExtended: value
							});
						}}
						placeholder="is a Research Assistant at Pew Research Center."
					/>
				</Fragment>
			)}
		</PluginDocumentSettingPanel>
	);
}

registerPlugin('prc-staff-info', {
	render: StaffInfoPanel,
	icon: null,
});
