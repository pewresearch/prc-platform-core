/**
 * External Dependencies
 */
import { WPEntitySearch } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { Button, ToggleControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { TAXONOMY, TAXONOMY_LABEL } from './constants';
import PlaceholderBlockAreaCreate from './PlaceholderBlockAreaCreate';
import PlaceholderBlockAreaSelect from './PlaceholderBlockAreaSelect';
import PlaceholderCategorySelect from './PlaceholderCategorySelect';

export default function PlaceholderWizard({ attributes, setAttributes, context, setInstructions, noticeOperations }) {
	const [readyToInsert, setReadyToInsert] = useState(false);
	const [disableNext, setDisableNext] = useState(false);
	const [blockAreaName, setBlockAreaName] = useState('');
	const [blockAreaSlug, setBlockAreaSlug] = useState(attributes?.blockAreaSlug);
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

	const onFinal = () => {
		console.log("ON FINAL", blockAreaName, blockAreaSlug, categorySlug);
		if (blockAreaName && !blockAreaSlug) {
			// Create new term and wait...

		} else if (blockAreaSlug) {
			setAttributes({ blockAreaSlug, categorySlug });
		}
	}

	// On page change:
	useEffect(() => {
		switch(step) {
			case 'intro':
				setInstructions(__('Search for an existing Block Area or create a new one'));
				break;
			case 'create-new':
				setInstructions(null);
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
				<Button variant="link" onClick={onNext} disabled={['intro', 'create-new'].includes(step) && !blockAreaSlug}>
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
