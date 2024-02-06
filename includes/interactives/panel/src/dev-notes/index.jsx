/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { sprintf } from '@wordpress/i18n';
import { Fragment, useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import { BaseControl, TextareaControl } from '@wordpress/components';
import { store as editorStore } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';

/**
 * Internal Dependencies
 */

export default function DevNotes({
	postType = 'interactive',
	postId,
	postSlug,
}) {
	const [meta, setMeta] = useEntityProp('postType', postType, 'meta');

	return (
		<BaseControl help={sprintf('Last edited by: %s', 'Seth Rubenstein')}>
			<TextareaControl
				label="Developer Notes"
				value={meta?._interactive_dev_notes || ''}
				onChange={(newNote) => setMeta({
					...meta,
					_interactive_dev_notes: newNote,
				})}
			/>
		</BaseControl>
	);
}
