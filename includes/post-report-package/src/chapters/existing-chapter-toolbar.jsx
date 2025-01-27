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
	const editLink = `${window?.prcPlatform?.siteUrl}/wp-admin/post.php?post=${postId}&action=edit`;
	const previewLink = `${window?.prcPlatform?.siteUrl}/?p=${postId}&preview=true`;
	return (
		<ButtonGroup>
			<Button
				variant="link"
				size="compact"
				href={editLink}
				target="_blank"
				icon={edit}
				label={__('Edit chapter; opens in new tab')}
				showTooltip
			>
				Edit
			</Button>
			<Button
				variant="link"
				size="compact"
				href={previewLink}
				target="_blank"
				icon={external}
				label={__('Preview chapter; opens in new tab')}
				showTooltip
			>
				Preview
			</Button>
		</ButtonGroup>
	);
}
