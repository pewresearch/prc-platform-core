/**
 * External Dependencies
 */
import { Icon } from '@prc/icons';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';

interface AISuggestToolbarButtonProps {
	/** Toolbar button label / tooltip. Defaults to "Suggest with AI". */
	label?: string;

	/** Click handler, typically opens a modal. */
	onClick: () => void;

	/** BlockControls toolbar group. Defaults to 'other'. */
	group?: string;
}

/**
 * Block toolbar button with the sparkles icon for AI features.
 *
 * Wraps `BlockControls` and `ToolbarButton` so consumers only need
 * to provide an `onClick` handler (usually to open a modal).
 * @param root0
 * @param root0.label
 * @param root0.onClick
 * @param root0.group
 */
export default function AISuggestToolbarButton({
	label,
	onClick,
	group = 'other',
}: AISuggestToolbarButtonProps) {
	return (
		<BlockControls group={group}>
			<ToolbarButton
				icon={
					<span className="prc-ai-suggest-button__icon">
						<Icon icon="sparkles" />
					</span>
				}
				label={label || __('Suggest with AI', 'prc-platform-core')}
				onClick={onClick}
			/>
		</BlockControls>
	);
}
