/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import Step from './_step';
import { createBlockArea } from '../../functions';

/**
 * Confirm Block Area and other taxonomy options are correct
 * @param {Object}   props
 * @param {string}   props.blockAreaSlug    The block area slug
 * @param {string}   props.categorySlug     The category slug
 * @param {boolean}  props.inheritCategory  Inherit category from context
 * @param {string}   props.newBlockAreaName The new block area name
 * @param {Function} props.setAttributes    Set the attributes
 * @param {Function} props.setNextStep      Set the next step
 * @param {Object}   props.buttonState      The button state
 * @param {Function} props.setButtonState   Set the button state
 */
export default function QueryC({
	blockAreaSlug,
	taxonomyName,
	taxonomyTermSlug,
	inheritTermFromTemplate,
	newBlockAreaName,
	setAttributes,
	setNextStep,
	buttonState,
	setButtonState,
}) {
	const [preConfirm, setPreConfirm] = useState(false);
	const [confirm, setConfirm] = useState(false);

	useEffect(() => {
		const newButtonargs = {
			...buttonState,
			text: 'Confirm Settings',
			disabled: false,
			onClick: () => setPreConfirm(true),
		};
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
			};
			setButtonState(newButtonargs);
		}
	}, [preConfirm]);

	useEffect(() => {
		if (confirm) {
			const newAttrs = {
				inheritTermFromTemplate,
			};
			if (taxonomyTermSlug) {
				newAttrs.taxonomyTermSlug = taxonomyTermSlug;
			}
			if (newBlockAreaName) {
				createBlockArea(newBlockAreaName).then((newBlockAreaSlug) => {
					newAttrs.blockAreaSlug = newBlockAreaSlug;
					console.log('New Block Area Slug:', newBlockAreaSlug, newAttrs);
					setAttributes(newAttrs);
				});
			} else {
				if (blockAreaSlug) {
					newAttrs.blockAreaSlug = blockAreaSlug;
				}
				console.log('New Attributes:', newAttrs);
				setAttributes(newAttrs);
			}
		}
	}, [confirm]);

	// if confirm is true then we're going to double check the below and if we're good great then well proceed, otherwise we'll setNextStep('create-a') and tell them to create a new block module.

	// Now that we have these values we're going to set them in the attributes. We're also going to do a quick query of the block modules and if we don't find one we're going to setNextStep('create-a') and tell them to create a new block module. That create-a step will need to look for categorySlug and blockAreaSlug and pass those values along to the newly created block_module post type...

	// Once we confirm the values we're going to create the block area if needs be.

	return (
		<Step>
			<h5 className="block-area-edit__review-settings-heading">
				Review Block Area Settings:
			</h5>
			{!newBlockAreaName && (
				<p>
					This area will render the latest public{' '}
					<pre>block_module</pre> that is in the{' '}
					<pre>{blockAreaSlug}</pre> block area
					{taxonomyTermSlug && (
						<span>
							{' '}
							and <pre>{taxonomyTermSlug}</pre> {taxonomyName}
						</span>
					)}
					{true === inheritTermFromTemplate && (
						<span>
							{' '}
							and will <pre>inherit the {taxonomyName}</pre> from
							available context
						</span>
					)}
					.
				</p>
			)}
			{newBlockAreaName && (
				<p>
					This area will render the latest public{' '}
					<pre>block_module</pre> that is in the new{' '}
					<pre>{newBlockAreaName}</pre> block area
					{taxonomyTermSlug && (
						<span>
							{' '}
							and <pre>{taxonomyTermSlug}</pre> {taxonomyName}
						</span>
					)}
					.
				</p>
			)}
		</Step>
	);
}
