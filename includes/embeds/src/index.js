/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { PluginBlockSettingsMenuItem } from '@wordpress/edit-post';
import { useSelect, useDispatch } from '@wordpress/data';
/**
 * Internal Dependencies
 */
import Controls from './controls';
import Icon from './icon';

const { prcEmbeds } = window;
const { allowedBlocks = [] } = prcEmbeds;

/**
 * Add support for the embed attributes on blocks registered client side.
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
addFilter(
	'blocks.registerBlockType',
	`prc-allow-embed-supports`,
	(settings) => {
		if (!allowedBlocks.includes(settings.name)) {
			return settings;
		}
		settings.attributes = {
			...settings.attributes,
			prcEmbed: {
				type: 'object',
				default: {
					enabled: false,
					id: null,
				},
			},
		};
		return settings;
	}
);

/**
 * Add the allowEmbed controls to the allowed blocks.
 */
addFilter(
	'editor.BlockEdit',
	`prc-allow-embed-controls`,
	createHigherOrderComponent(
		(BlockEdit) =>
			function EmbedControlGroup(props) {
				const { name, attributes, setAttributes, clientId } = props;

				if (!allowedBlocks.includes(name)) {
					return <BlockEdit {...props} />;
				}

				return (
					<Fragment>
						<Controls
							{...{ attributes, setAttributes, clientId }}
						/>
						<BlockEdit {...props} />
					</Fragment>
				);
			},
		'withEmbedControls'
	),
	21
);

function BlockSettingsMenuQuickToggle() {
	const { updateBlockAttributes } = useDispatch('core/block-editor');
	const { selectedBlock } = useSelect((select) => {
		const { getSelectedBlock } = select('core/block-editor');
		return {
			selectedBlock: getSelectedBlock(),
		};
	}, []);

	const isEnabled = selectedBlock?.attributes?.prcEmbed?.enabled;
	const embedId = selectedBlock?.attributes?.prcEmbed?.id;

	const onChange = () => {
		const clientId = selectedBlock?.clientId;
		if (!clientId) {
			return;
		}
		if (null === embedId) {
			updateBlockAttributes(clientId, {
				prcEmbed: {
					enabled: !isEnabled,
					id: Math.random().toString(36).substr(2, 4),
				},
			});
		} else {
			updateBlockAttributes(clientId, {
				prcEmbed: {
					enabled: !isEnabled,
					id: embedId,
				},
			});
		}
	};

	return (
		<PluginBlockSettingsMenuItem
			allowedBlocks={allowedBlocks}
			icon={<Icon />}
			label={isEnabled ? 'Disable embed' : 'Enable embed'}
			onClick={() => {
				onChange();
			}}
		/>
	);
}

registerPlugin('block-settings-menu-group-test', {
	render: BlockSettingsMenuQuickToggle,
});
