/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */

/**
 * WordPress Dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { register } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import icon from './icon';
import edit from './edit';
import save from './save';
import metadata from './block.json';
import { store } from './store';

const { name } = metadata;

const settings = {
	icon,
	edit,
	save,
};

register(store);

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType(name, { ...metadata, ...settings });
