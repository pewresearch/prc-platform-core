/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';

interface AILoadingIndicatorProps {
	/** Descriptive message shown next to the spinner. Defaults to "Generating...". */
	message?: string;
}

/**
 * Centered loading spinner with a message, used inside modals
 * and inline panels during AI ability execution.
 * @param root0
 * @param root0.message
 */
export default function AILoadingIndicator({
	message,
}: AILoadingIndicatorProps) {
	return (
		<div className="prc-ai-loading">
			<Spinner />
			<span className="prc-ai-loading__message">
				{message || __('Generating…', 'prc-platform-core')}
			</span>
		</div>
	);
}
