/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Spinner, Flex, FlexBlock, FlexItem } from '@wordpress/components';

export default function LoadingIndicator({
	enabled,
	label = __('Loading…', 'prc-platform-core'),
}) {
	if (!enabled) {
		return null;
	}
	return (
		<Flex align="center" justify="center">
			<FlexItem>
				<Spinner />
			</FlexItem>
			<FlexBlock>
				<span>{label}</span>
			</FlexBlock>
		</Flex>
	);
}
