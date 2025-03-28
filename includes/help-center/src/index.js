/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, createPortal, useState } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { Button } from '@wordpress/components';
import { PinnedItems } from '@wordpress/interface';
import { Icon, helpFilled } from '@wordpress/icons';

import Panel from './panel';

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
		<Fragment>
			<PinnedItems scope="core">
				<Button
					onClick={() => setIsOpen(!isOpen)}
					description={__('Help Center')}
					size="compact"
					isPressed={isOpen}
					icon={helpFilled}
				/>
			</PinnedItems>
			{createPortal(
				<Panel isOpen={isOpen} close={() => setIsOpen(false)} />,
				renderEl
			)}
		</Fragment>
	);
}

registerPlugin(PLUGIN_NAME, { render: HelpCenter });
