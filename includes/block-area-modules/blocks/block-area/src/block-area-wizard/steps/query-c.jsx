/**
 * WordPress Dependencies
 */

import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from 'react';

/**
 * Internal Dependencies
 */
import Step from './_step';
import { createBlockArea, createBlockModule } from '../../functions';

export default function QueryC({
	blockAreaSlug,
	categorySlug,
	inheritCategory,
	newBlockAreaName,
	setAttributes,
	setNextStep,
	buttonState,
	setButtonState,
}){
	const [preConfirm, setPreConfirm] = useState(false);
	const [confirm, setConfirm] = useState(false);

	useEffect(() => {
		const newButtonargs = {
			...buttonState,
			text: 'Confirm Settings',
			disabled: false,
			onClick: () => setPreConfirm(true),
		}
		setButtonState(newButtonargs);
	}, []);

	useEffect(() => {
		if (preConfirm) {
			const newButtonargs = {
				...buttonState,
				text: 'Insert Block Area',
				disabled: false,
				variant: 'primary',
				onClick: () => setConfirm(true),
			}
			setButtonState(newButtonargs);
		}
	}, [preConfirm]);

	useEffect(() => {
		if (confirm) {
			const newAttrs = {
				inheritCategory,
			};
			if (categorySlug) {
				newAttrs.categorySlug = categorySlug;
			}
			if (newBlockAreaName) {
				createBlockArea(newBlockAreaName).then((newBlockAreaSlug) => {
					newAttrs.blockAreaSlug = newBlockAreaSlug;
					setAttributes(newAttrs);
				});
			} else {
				if (blockAreaSlug) {
					newAttrs.blockAreaSlug = blockAreaSlug;
				}
				setAttributes(newAttrs);
			}
		}
	}, [confirm]);

	// if confirm is true then we're going to double check the below and if we're good great then well proceed, otherwise we'll setNextStep('create-a') and tell them to create a new block module.

	// Now that we have these values we're going to set them in the attributes. We're also going to do a quick query of the block modules and if we don't find one we're going to setNextStep('create-a') and tell them to create a new block module. That create-a step will need to look for categorySlug and blockAreaSlug and pass those values along to the newly created block_module post type...

	// Once we confirm the values we're going to create the block area if needs be.

	return(
		<Step>
			<h5 className="block-area-edit__review-settings-heading">Review Block Area Settings:</h5>
			{!newBlockAreaName && <p>This area will render the latest public <pre>block_module</pre> that is in the <pre>{blockAreaSlug}</pre> block area{categorySlug && <span> and <pre>{categorySlug}</pre> category</span>}{true === inheritCategory && <span> and will <pre>inherit the category</pre> from available context</span>}.</p>}
			{newBlockAreaName && <p>This area will render the latest public <pre>block_module</pre> that is in the new <pre>{newBlockAreaName}</pre> block area{categorySlug && <span> and <pre>{categorySlug}</pre> category</span>}.</p>}
		</Step>
	);
}
