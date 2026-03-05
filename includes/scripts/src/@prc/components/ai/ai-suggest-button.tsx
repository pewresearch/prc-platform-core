/**
 * External Dependencies
 */
import { Icon } from '@prc/icons';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Spinner } from '@wordpress/components';

interface AISuggestButtonProps {
	/** Button label text. Defaults to "Suggest with AI". */
	label?: string;

	/** Button text. Defaults to "Suggest with AI". */
	text?: string;

	/** Click handler to trigger the AI suggestion. */
	onClick: () => void;

	/** When true the button is disabled to indicate work in progress. */
	isLoading?: boolean;

	/** Explicitly disable the button regardless of loading state. */
	disabled?: boolean;

	/** Button visual variant. Defaults to 'secondary'. */
	variant?: 'secondary' | 'tertiary';

	/** Button size. Defaults to 'compact'. */
	size?: 'default' | 'compact' | 'small';

	/** Whether the button stretches to fill its container. Defaults to true. */
	fullWidth?: boolean;
}

/**
 * Standardised AI trigger button with the sparkles icon.
 *
 * Replaces the hand-rolled buttons previously duplicated across
 * prc-schema-seo, prc-related-posts, prc-social, and prc-block-library.
 * @param root0
 * @param root0.label
 * @param root0.text
 * @param root0.onClick
 * @param root0.isLoading
 * @param root0.disabled
 * @param root0.variant
 * @param root0.size
 * @param root0.fullWidth
 */
export default function AISuggestButton({
	label = __('Suggest with AI', 'prc-platform-core'),
	text = __('Suggest with AI', 'prc-platform-core'),
	onClick,
	isLoading = false,
	disabled = false,
	variant = 'secondary',
	size = 'compact',
	fullWidth = true,
}: AISuggestButtonProps) {
	return (
		<Button
			className="prc-ai-suggest-button"
			variant={variant}
			size={size}
			isBusy={isLoading}
			icon={
				<span className="prc-ai-suggest-button__icon">
					<Icon icon="sparkles" />
				</span>
			}
			onClick={onClick}
			disabled={isLoading || disabled}
			style={
				fullWidth
					? { width: '100%', justifyContent: 'center' }
					: undefined
			}
			label={label}
		>
			{text}
		</Button>
	);
}
