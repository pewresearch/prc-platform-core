/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorAdvancedControls } from '@wordpress/block-editor';
import {
	BaseControl,
	ExternalLink,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export default function Controls({ attributes, setAttributes }) {
	const { prcEmbed } = attributes;

	const { enabled, id } = prcEmbed;

	const previewLink = useSelect(
		(select) => {
			const { getPermalink } = select('core/editor');
			return `${getPermalink()}iframe/${id}`;
		},
		[id]
	);

	const onChange = () => {
		if (null === id) {
			setAttributes({
				prcEmbed: {
					enabled: !enabled,
					id: Math.random().toString(36).substr(2, 4),
				},
			});
		} else {
			setAttributes({
				prcEmbed: {
					enabled: !enabled,
					id,
				},
			});
		}
	};

	return (
		<InspectorAdvancedControls>
			<BaseControl
				id="prc-platform-embeds"
				label={__('Iframe Settings', 'prc-platform')}
				help={
					enabled
						? `This block will be visible via iframe at: ${previewLink}`
						: null
				}
			>
				<ToggleControl
					label={enabled ? __('Enabled') : __('Disabled')}
					checked={enabled}
					onChange={onChange}
				/>
				{null !== id && enabled && (
					<ExternalLink href={previewLink}>
						Preview embed
					</ExternalLink>
				)}
			</BaseControl>
		</InspectorAdvancedControls>
	);
}
