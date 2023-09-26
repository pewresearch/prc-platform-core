/**
 * External Dependencies
 */
import { useDebounce } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect, useMemo } from '@wordpress/element';
import { Button, Placeholder, TextControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';


/**
 * Internal Dependencies
 */
import { POST_TYPE, POST_TYPE_LABEL, TAXONOMY } from './constants';

/**
 * A simple components that allows a user to create a new Block Module post.
 * @param {*} param0
 * @returns
 */
export default function BlockModuleCreate({ blockAreaSlug, categorySlug, onCreation = () => {} }) {
	const { saveEntityRecord } = useDispatch(coreStore);

	const [allowCreation, setAllowCreation] = useState(false);
	const [newBlockModuleTitle, setNewBlockModuleTitle] = useState('');

	const onCreate = async () => {
		if ( ! allowCreation ) {
			return false;
		}
		if ( !categorySlug ) {
			return new Error('No category slug provided.');
		}
		if ( !blockAreaSlug ) {
			return new Error('No block area slug provided.');
		}

		const newBlockModule = await saveEntityRecord(
			'postType',
			POST_TYPE,
			{
				title: newBlockModuleTitle,
				status: 'publish',
				terms: {
					[TAXONOMY]: [blockAreaSlug],
					category: [categorySlug],
				}
			}
		);

		if ( newBlockModule ) {
			// Reset the values:
			setNewBlockModuleTitle('');
			console.log('onCreateBlockModule', newBlockModule);
			return newBlockModule;
		}

		return false;
	}

	useEffect(() => {
		if (newBlockModuleTitle && newBlockModuleTitle.length > 3 && !!categorySlug && !!blockAreaSlug) {
			setAllowCreation(true);
		} else {
			setAllowCreation(false);
		}
	}, [newBlockModuleTitle, categorySlug, blockAreaSlug]);

	return (
		<Placeholder label={__(`Create New ${POST_TYPE_LABEL}`, 'prc-platform-core')} isColumnLayout={true}>
			<TextControl
				label={__(`New ${POST_TYPE_LABEL} Title`, 'prc-platform-core')}
				help={__(`Enter a title for the new ${POST_TYPE_LABEL}`, 'prc-platform-core')}
				value={ newBlockModuleTitle }
				onChange={ ( newTitle ) => setNewBlockModuleTitle( newTitle ) }
			/>
			<Button
				variant="primary"
				onClick={() => onCreate().then((resp) => onCreation(resp).catch((err) => console.error(err)))}
				disabled={!allowCreation}
			>
				{__(`Create New ${POST_TYPE_LABEL}`, 'prc-platform-core')}
			</Button>
		</Placeholder>
	);
}
