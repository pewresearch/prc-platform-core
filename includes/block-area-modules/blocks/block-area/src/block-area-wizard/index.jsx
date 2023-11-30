/**
 * WordPress Dependencies
 */
import { useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';
import {
	ButtonGroup,
	Button,
	Placeholder
} from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { Intro, QueryA, QueryB, QueryC, SelectA, CreateA } from './steps';
import Icon from '../icon';

const STEPS = [
	'intro', // Choose "Query by Block Area", "Select Specific Block Module", or "Create New Module"
	'query-a', // We enter the query block area setup, first we either select or create a new block area slug.
	'query-b', // We either select the category slug, select inheirt category, or no category and thus we'd just pick whatever is most recent in the block area.
	'query-c', // We review the settings and then click finish.
	'create-a', // We enter the block module setup, we can give it a title and select whether it should publish immediately or at a future date (draft).
	'create-b', // We enter the block area setup, first we either select or create a new block area slug or we determine we don't want a block area, we explain that means we will only pull in this block module and then we set the ref.
	'create-c', // We review the settings and then click finish.
	'select-a', // We open a modal with the templateparts like selector. There is no revie stage here, we immediately set the ref and load the block module.
];

export default function BlockAreaWizard({
	attributes,
	setAttributes,
	blockModules,
	isResolving,
	context,
	clientId,
}) {
	const { templateSlug } = context;
	const [blockAreaSlug, setBlockAreaSlug] = useState(attributes?.blockAreaSlug);
	const [categorySlug, setCategorySlug] = useState(attributes?.categorySlug);
	const [inheritCategory, setInheritCategory] = useState(attributes?.inheritCategory);
	const [allowCategorySelection, setAllowCategorySelection] = useState(false);
	const toggleAllowCategorySelection = () => {
		setAllowCategorySelection(!allowCategorySelection);
	}

	const [activeStep, setActiveStep] = useState('intro');
	const setNextStep = (nextStep) => {
		setActiveStep(nextStep);
	}
	const [buttonState, setButtonState] = useState({
		variant: 'secondary',
		isLoading: false,
		text: 'Next',
		onClick: null,
		disabled: false,
	});

	const [newBlockAreaName, setNewBlockAreaName] = useState(false);

	const allowPrevious = useMemo(() => {
		switch (activeStep) {
			case 'intro':
				return null;
			case 'query-a':
				return true;
			case 'query-b':
				return true;
			case 'query-c':
				return true;
			case 'create-a':
				return true;
			case 'create-b':
				return true;
			case 'select-a':
				return true;
			default:
				return true;
		}
	}, [activeStep]);

	return (
		<Placeholder
			label={__('Block Area', 'prc-platform-core')}
			isColumnLayout={true}
			icon={() => <Icon color={null}/>}
		>
			<div className="block-area-edit__placeholder-inner">
				{['intro','create-a'].includes(activeStep) && (
					<Intro
					{...{
						isResolving,
						blockModules,
						buttonState,
						setButtonState,
						setNextStep,
						isResolving,
					}}
					/>
				)}
				{activeStep === 'query-a' && (
					<QueryA
					{...{
						blockAreaSlug,
						setBlockAreaSlug,
						newBlockAreaName,
						setNewBlockAreaName,
						setNextStep,
						buttonState,
						setButtonState
					}}
					/>
				)}
				{activeStep === 'query-b' && (
					<QueryB
					{...{
						categorySlug,
						setCategorySlug,
						templateSlug,
						allowCategorySelection,
						inheritCategory,
						toggleAllowCategorySelection,
						setInheritCategory,
						buttonState,
						setButtonState,
						setNextStep,
					}}
					/>
				)}
				{activeStep === 'query-c' && (
					<QueryC {...{
						blockAreaSlug,
						categorySlug,
						inheritCategory,
						newBlockAreaName,
						setAttributes,
						setNextStep,
						buttonState,
						setButtonState
					}}/>
				)}
				{activeStep === 'select-a' && (
					<SelectA {...{
						clientId,
						onSelect: ({id}) => {
							setAttributes({
								ref: id,
							});
						},
						onClose: () => {
							setNextStep('intro');
						},
					}}/>
				)}
				{activeStep === 'create-a' && (
					<CreateA {...{
						onCreate: (id) => {
							setAttributes({
								ref: id,
							});
						},
						setNextStep,
					}}/>
				)}
				{!['intro', 'create-a'].includes(activeStep) && (
					<div className="block-area-edit__toolbar">
						{null !== allowPrevious && (
							<Button
								variant="secondary"
								disabled={!allowPrevious}
								onClick={() => {
									if (null !== allowPrevious) {
										// if activeStep is query-a we're going back to intro, if its query-b we're going back to query-a, if its query-c we're going back to query-b.
										// if activestep is create-a we're going back to intro, if its create-b we're going back to create-a.
										// if activeStep is select-a we're going back to intro.
										if ('intro' === activeStep) {
											setActiveStep('intro');
										} else if ('query-a' === activeStep) {
											setActiveStep('intro');
										} else if ('query-b' === activeStep) {
											setActiveStep('query-a');
										} else if ('query-c' === activeStep) {
											setActiveStep('query-b');
										} else if ('create-a' === activeStep) {
											setActiveStep('intro');
										} else if ('create-b' === activeStep) {
											setActiveStep('create-a');
										} else if ('select-a' === activeStep) {
											setActiveStep('intro');
										}
									}
								}}
							>
								Back
							</Button>
						)}
						<Button
							variant={buttonState.variant}
							disabled={buttonState.disabled}
							onClick={() => {
								if (null !== buttonState.onClick) {
									buttonState.onClick();
								}
							}}
						>
							{buttonState.text}
						</Button>
					</div>
				)}
			</div>
		</Placeholder>
	);
}
