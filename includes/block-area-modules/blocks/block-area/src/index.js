/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */

/**
 * WordPress Dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal Dependencies
 */
import './editor.scss';
import './style.scss';
import deprecated from './deprecated';
import icon from './icon';
import edit from './edit';
import variations from './variations';
import metadata from './block.json';

const { name } = metadata;

const settings = {
	icon,
	edit,
	variations,
	deprecated,
};

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType(name, { ...metadata, ...settings });
