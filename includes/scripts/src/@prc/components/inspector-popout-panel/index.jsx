/* eslint-disable max-lines-per-function */
/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { useState, useMemo } from '@wordpress/element';
import { Dropdown } from '@wordpress/components';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';

export default function InspectorPopoutPanel({
	title,
	className,
	children,
	renderToggle,
}) {
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	const popoverProps = useMemo(
		() => ({
			// Anchor the popover to the middle of the entire row so that it doesn't
			// move around when/if the title changes.
			anchor: popoverAnchor,
			placement: 'left-start',
			offset: 36,
			shift: true,
		}),
		[popoverAnchor]
	);

	return (
		<div ref={setPopoverAnchor} className={className}>
			<Dropdown
				popoverProps={popoverProps}
				focusOnMount
				renderToggle={renderToggle}
				renderContent={({ onClose }) => (
					<div>
						<InspectorPopoverHeader
							title={title}
							onClose={onClose}
						/>
						{children}
					</div>
				)}
			/>
		</div>
	);
}
