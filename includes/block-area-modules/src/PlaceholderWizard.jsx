/**
 * External Dependencies
 */
import { WPEntitySearch } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect, useMemo } from '@wordpress/element';
import { Button, ToggleControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { cleanForSlug } from '@wordpress/url';

/**
 * Internal Dependencies
 */
import { TAXONOMY, POST_TYPE } from './constants';
import PlaceholderBlockAreaCreate from './PlaceholderBlockAreaCreate';
import PlaceholderBlockAreaSelect from './PlaceholderBlockAreaSelect';
import PlaceholderCategorySelect from './PlaceholderCategorySelect';

export default function PlaceholderWizard({ attributes, setAttributes, context, setInstructions, noticeOperations }) {
	const [readyToInsert, setReadyToInsert] = useState(false);
	// const [disableNext, setDisableNext] = useState(false);
	const [blockAreaName, setBlockAreaName] = useState('');
	const [blockAreaSlug, setBlockAreaSlug] = useState(attributes?.blockAreaSlug);
	const [blockModuleName, setBlockModuleName] = useState('');
	const [blockModuleSlug, setBlockModuleSlug] = useState(attributes?.blockAreaSlug);
	const [categorySlug, setCategorySlug] = useState(attributes?.categorySlug);
	const [step, setStep] = useState('intro');
	const [processing, setProcessing] = useState(false);

	const onBack = () => {
		switch (step) {
			case 'intro':
				break;
			case 'create-new':
				setStep('intro');
				break;
			case 'final':
				setStep('intro');
				break;
			default:
				break;
		}
	}

	const onNext = () => {
		switch (step) {
			case 'intro':
				if (blockAreaSlug) {
					setStep('final');
				} else {
					setStep('create-new');
				}
				break;
			case 'create-new':
				setStep('final');
				break;
			case 'final':
				break;
			default:
				break;
		}
	}

	const onCreateNewBlockArea = async (name) => {
		const slug = cleanForSlug(name);
		const newBlockArea = await saveEntityRecord(
			'taxonomy',
			TAXONOMY,
			{
				name,
				slug
			}
		);
		if ( newBlockArea ) {
			console.log('newDraftBlockArea', newBlockArea);
			setBlockAreaSlug(slug);
		}
	}

	const onCreateNewBlockModule = async (title) => {
		const newDraftPost = await saveEntityRecord(
			'postType',
			POST_TYPE,
			{
				title,
				status: 'publish',
				terms: {
					[TAXONOMY]: [blockAreaSlug],
				}
			}
		);
		if ( newDraftPost ) {
			console.log('newDraftBlockArea', newDraftPost);
		}
	}

	const onFinal = () => {
		console.log("ON FINAL", blockAreaName, blockAreaSlug, categorySlug);
		if (blockAreaName && !blockAreaSlug) {
			// Create new term and wait...
			onCreateNewBlockArea(blockAreaName);
		} else if (blockAreaSlug) {
			const newAttrs = { blockAreaSlug };
			if (categorySlug) {
				newAttrs.categorySlug = categorySlug;
			}
			setAttributes(newAttrs);
		}
	}

	const nextDisabled = useMemo(() => {
		console.log('nextDisabled', step, blockAreaName.length, blockAreaSlug);
		return ['intro', 'create-new'].includes(step) && blockAreaName.length <= 3;
	}, [step, blockAreaName]);

	// On page change:
	useEffect(() => {
		switch(step) {
			case 'intro':
				setInstructions(__('Search for an existing Block Area or create a new one'));
				break;
			case 'create-new':
				setInstructions(null);
				if ( blockAreaName.length <= 3)
				break;
			case 'final':
				if (context?.templateSlug?.includes('category')) {
					setInstructions(__('This template has one or more categories selected. Would you like to use that category for this block area?'));
				} else {
					setInstructions(__('Select a category to filter the Block Area by'));
				}
				break;
			default:
				break;
		}
	}, [step]);

	return (
		<div>
			{'intro' === step && (
				<Fragment>
					<PlaceholderBlockAreaSelect {...{
						setBlockAreaSlug,
						context
					}}/>
				</Fragment>
			)}
			{'create-new' === step && (
				<Fragment>
					<PlaceholderBlockAreaCreate {...{
						setBlockAreaName,
						context
					}}/>
				</Fragment>
			)}
			{'final' === step && (
				<PlaceholderCategorySelect {...{
					attributes,
					setAttributes,
					setCategory: setCategorySlug,
					context
				}}/>
			)}
			{'intro' === step && (
				<Button variant="link" onClick={() => setStep('create-new')}>
					{__('Create New Block Area')}
				</Button>
			)}
			{'final' !== step && (
				<Button variant="link" onClick={onNext} disabled={nextDisabled}>
					{__('Next')}
				</Button>
			)}
			{'intro' !== step && (
				<Button variant="link" onClick={onBack}>
					{__('Back')}
				</Button>
			)}
			{'final' === step && (
				<Button variant="primary" onClick={onFinal}>
					{__('Insert Block Area')}
				</Button>
			)}
		</div>
	);
}
