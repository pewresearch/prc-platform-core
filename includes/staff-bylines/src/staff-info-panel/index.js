/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { ToggleControl, TextControl } from '@wordpress/components';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';

function BylineConfigPanel() {
	const { postType } = useSelect(
		(select) => ({
			postType: select('core/editor').getCurrentPostType(),
		}),
		[],
	);

	const [meta, setMeta] = useEntityProp('postType', postType, 'meta');

	const jobTitle = meta.job_title;
	const miniJobTitle = meta.job_title_mini_bio;
	const { twitter } = meta;
	const bylineEnabled = meta.promote_to_byline;

	return (
		<PluginDocumentSettingPanel
			name="prc-staff-bylines"
			title="Staff Byline/Bio"
		>
			<TextControl
				label={__('Job Title')}
				help={__(
					"The job title of the staff member, this will appear in the staff listing and on this staff member's bio page (if enabled)",
				)}
				value={jobTitle}
				onChange={(value) => {
					setMeta({ ...meta, job_title: value });
				}}
				placeholder="Research Assistant"
			/>
			<ToggleControl
				label={__('Enable Byline')}
				help={__(
					'Once you enable a byline you CAN NOT disable it. If this staff member is no longer with the center change their staff type to Former.',
				)}
				checked={bylineEnabled}
				onChange={() => {
					setMeta({ ...meta, promote_to_byline: !bylineEnabled });
				}}
				disabled={true === bylineEnabled}
			/>
			{bylineEnabled && (
				<Fragment>
					<TextControl
						label={__('Mini Bio')}
						help={__('This mini bio appears under Short Read posts')}
						value={miniJobTitle}
						onChange={(value) => {
							setMeta({ ...meta, job_title_mini_bio: value });
						}}
						placeholder="is a Research Assistant..."
					/>
					<TextControl
						label={__('Twitter')}
						help={__(
							'The twitter handle of this staff member, this will appear on their bio page and wherever the mini bio appears.',
						)}
						value={twitter}
						placeholder="@pewresearch"
						onChange={(value) => {
							setMeta({ ...meta, twitter: value });
						}}
					/>
				</Fragment>
			)}
		</PluginDocumentSettingPanel>
	);
}

registerPlugin('prc-staff-bylines', {
	render: BylineConfigPanel,
	icon: null,
});
