/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { createPortal, useState } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { useSelect } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { PinnedItems } from '@wordpress/interface';
import { Icon } from '@prc/icons';
import Panel from './Panel';

const PLUGIN_NAME = 'prc-platform-help-center';

function HelpCenter() {
	const [isOpen, setIsOpen] = useState(false);
	const editorEl = document.querySelector('.block-editor__container');
	const templateEditorEl = document.querySelector('.edit-site');
	const renderEl = editorEl || templateEditorEl;
	if (!renderEl) {
		return null;
	}
	return (
		<>
			<PinnedItems scope="core">
				<Button
					onClick={() => setIsOpen(!isOpen)}
					description={__('Help Center')}
					size="default"
				>
					<Icon icon="message-question" library="regular" />
				</Button>
			</PinnedItems>
			{createPortal(
				<Panel isOpen={isOpen} close={() => setIsOpen(false)} />,
				renderEl
			)}
		</>
	);
}

registerPlugin(PLUGIN_NAME, {
	render: HelpCenter,
});
