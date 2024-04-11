/**
 * External Dependencies
 */
import classNames from 'classnames';
import { useKeyPress } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useState, useEffect, useRef } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import {
	BaseControl,
	Tooltip,
	SelectControl,
	Modal,
} from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { useAttachments } from './context';

function File({ id, url, title, type }) {
	const { openMediaLibrary } = useAttachments();
	return (
		<BaseControl>
			<button
				type="button"
				key={id}
				className={classNames('prc-attachments-list__file')}
				onClick={() => {
					openMediaLibrary(id);
				}}
			>
				<div>{title}</div>
			</button>
		</BaseControl>
	);
}

export default File;
