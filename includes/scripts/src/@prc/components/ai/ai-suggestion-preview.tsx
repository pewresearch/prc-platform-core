/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

interface AISuggestionPreviewProps {
	/** The preview content rendered by the consumer. */
	children: React.ReactNode;

	/** Called when the user confirms the suggestion. */
	onApply: () => void;

	/** Called when the user discards the suggestion. */
	onDismiss: () => void;

	/** Called when the user wants a fresh suggestion. Optional. */
	onRegenerate?: () => void;

	/** Label for the apply button. Defaults to "Apply". */
	applyLabel?: string;

	/** Label for the dismiss button. Defaults to "Dismiss". */
	dismissLabel?: string;

	/** Label for the regenerate button. Defaults to "Regenerate". */
	regenerateLabel?: string;

	/** Header text above the preview. Defaults to "AI Suggestions". */
	headerLabel?: string;
}

/**
 * Bordered preview box that displays AI-generated content with
 * Apply / Dismiss / Regenerate action buttons.
 *
 * The consumer controls what is rendered inside via `children`
 * (key-value fields, markdown preview, etc.).
 * @param root0
 * @param root0.children
 * @param root0.onApply
 * @param root0.onDismiss
 * @param root0.onRegenerate
 * @param root0.applyLabel
 * @param root0.dismissLabel
 * @param root0.regenerateLabel
 * @param root0.headerLabel
 */
export default function AISuggestionPreview({
	children,
	onApply,
	onDismiss,
	onRegenerate,
	applyLabel,
	dismissLabel,
	regenerateLabel,
	headerLabel,
}: AISuggestionPreviewProps) {
	return (
		<div className="prc-ai-preview">
			<p className="prc-ai-preview__header">
				{headerLabel || __('AI Suggestions', 'prc-platform-core')}
			</p>

			<div className="prc-ai-preview__content">{children}</div>

			<div className="prc-ai-preview__actions">
				<Button variant="primary" onClick={onApply} size="compact">
					{applyLabel || __('Apply', 'prc-platform-core')}
				</Button>
				<Button variant="tertiary" onClick={onDismiss} size="compact">
					{dismissLabel || __('Dismiss', 'prc-platform-core')}
				</Button>
				{onRegenerate && (
					<Button
						variant="tertiary"
						onClick={onRegenerate}
						size="compact"
					>
						{regenerateLabel ||
							__('Regenerate', 'prc-platform-core')}
					</Button>
				)}
			</div>
		</div>
	);
}
