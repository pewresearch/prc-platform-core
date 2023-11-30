/**
 * External Dependencies
 */
import { edit, external } from '@wordpress/icons';
/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, ButtonGroup, useEffect } from '@wordpress/components';

export default function ExistingBackChapterToolbar({ postId, currentPostId }) {
	if (postId === currentPostId) {
		return null;
	}
	return(
		<ButtonGroup>
			<Button variant="link" size="compact" href={`/pewresearch-org/wp-admin/post.php?post=${postId}&action=edit`} target="_blank" icon={edit} label={__('Edit back chapter; opens in new tab')} showTooltip shortcut="e">
				Edit
			</Button>
			<Button variant="link" size="compact" href={`www.google.com`} target="_blank" icon={external} label={__('Preview back chapter; opens in new tab')} showTooltip shortcut="p">
				Preview
			</Button>
		</ButtonGroup>
	);
}
