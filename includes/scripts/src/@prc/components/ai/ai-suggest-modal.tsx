/**
 * WordPress Dependencies
 */
import { Modal, Notice } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import AILoadingIndicator from './ai-loading-indicator';

interface AISuggestModalProps {
	/** Modal title shown in the header bar. */
	title: string;

	/** Controls modal visibility. */
	isOpen: boolean;

	/** Called when the modal is dismissed (X button, overlay click, Escape). */
	onClose: () => void;

	/** When true, shows the loading indicator instead of children. */
	isLoading?: boolean;

	/** Message displayed alongside the loading spinner. */
	loadingMessage?: string;

	/** Error message to display. Null or undefined hides the notice. */
	error?: string | null;

	/** Called when the user dismisses the error notice. */
	onDismissError?: () => void;

	/** Content slot, rendered when not loading. */
	children: React.ReactNode;

	/** Optional footer slot for action buttons (rendered below children). */
	footer?: React.ReactNode;

	/** Maximum modal width. Defaults to '560px'. */
	maxWidth?: string;
}

/**
 * Composable modal shell for AI suggestion flows.
 *
 * Manages three visual states:
 *  1. **Loading** -- centred spinner with a message.
 *  2. **Error** -- warning Notice (optionally dismissible).
 *  3. **Results** -- renders `children` and an optional `footer`.
 *
 * Consumers compose different result displays (AISuggestionsList,
 * AISuggestionPreview, custom forms) by passing them as children.
 * @param root0
 * @param root0.title
 * @param root0.isOpen
 * @param root0.onClose
 * @param root0.isLoading
 * @param root0.loadingMessage
 * @param root0.error
 * @param root0.onDismissError
 * @param root0.children
 * @param root0.footer
 * @param root0.maxWidth
 */
export default function AISuggestModal({
	title,
	isOpen,
	onClose,
	isLoading = false,
	loadingMessage,
	error,
	onDismissError,
	children,
	footer,
	maxWidth = '560px',
}: AISuggestModalProps) {
	if (!isOpen) {
		return null;
	}

	return (
		<Modal
			title={title}
			onRequestClose={onClose}
			className="prc-ai-modal"
			style={{ maxWidth, width: '100%' }}
		>
			{isLoading && (
				<div className="prc-ai-modal__loading">
					<AILoadingIndicator message={loadingMessage} />
				</div>
			)}

			{error && (
				<Notice
					status="warning"
					isDismissible={!!onDismissError}
					onDismiss={onDismissError}
				>
					{error}
				</Notice>
			)}

			{!isLoading && <>{children}</>}

			{!isLoading && footer && (
				<div className="prc-ai-modal__footer">{footer}</div>
			)}
		</Modal>
	);
}
