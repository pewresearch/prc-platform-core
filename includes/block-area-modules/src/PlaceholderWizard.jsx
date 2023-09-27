/**
 * External Dependencies
 */
import styled from '@emotion/styled';
import { symbolFilled as icon } from '@wordpress/icons';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	ButtonGroup,
	Button,
	Spinner,
	Placeholder
} from '@wordpress/components';
import { useMemo, useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { TAXONOMY_LABEL, POST_TYPE_LABEL } from './constants';
import BlockAreaCreate, { createBlockArea } from './BlockAreaCreate';
import BlockAreaSearch from './BlockAreaSearch';
import CategorySearchSelect from './CategorySearchSelect';
import PlaceholderWizardSummary from './PlaceholderWizardSummary';

const STEPS = [
	'block-area-search',
	'block-area-create', // Only load if now value is set in block-area-search.
	'category-search-select',
];

const INSTRUCTIONS = [
	__(`${TAXONOMY_LABEL}s are used to display ${POST_TYPE_LABEL}s content. Think of these as editorially driven template parts or "sections" of your theme. Select an existing one from this screen, or click next to create a new one.`, 'prc-platform-core'),
	__(`${TAXONOMY_LABEL}s are used to display ${POST_TYPE_LABEL}s content. Think of these as editorially driven template parts or "sections" of your theme. Create a new one from this screen, or go back and select an existing one.`, 'prc-platform-core'),
	__('Select a Category to use', 'prc-platform-core'),
]

const PlaceholderInner = styled.div`
	display: block;
`;

const Toolbar = styled(ButtonGroup)`
	margin-top: 1em;
`

export default function PlaceholderWizard({
	attributes,
	setAttributes,
	clientId,
	isResolving,
	blockModuleId,
	context,
}) {
	const [blockAreaSlug, setBlockAreaSlug] = useState(attributes?.blockAreaSlug);
	const [categorySlug, setCategorySlug] = useState(attributes?.categorySlug);
	const [inheritCategory, setInheritCategory] = useState(attributes?.inheritCategory);
	const [activeStep, setActiveStep] = useState('block-area-search');
	const [newBlockAreaName, setNewBlockAreaName] = useState(false);

	const allowCompletion = true;

	const allowNext = useMemo(() => {
		if ('block-area-search' === activeStep) {
			return false !== blockAreaSlug;
		}
		if ('block-area-create' === activeStep) {
			return false !== newBlockAreaName;
		}
		if ('category-search-select' === activeStep) {
			return false !== categorySlug || true === inheritCategory;
		}
		return false;
	}, [activeStep, blockAreaSlug, newBlockAreaName, categorySlug]);

	const onFinish = () => {
		if ( ! allowCompletion ) {
			return false;
		}

		const newAttrs = {
			categorySlug,
			inheritCategory,
		}

		if (false !== newBlockAreaName ) {
			createBlockArea(newBlockAreaName).then((newBlockAreaSlug) => {
				setAttributes({
					blockAreaSlug: newBlockAreaSlug,
				});
			}).catch((err) => {
				console.error(err);
			});
		} else {
			newAttrs.blockAreaSlug = blockAreaSlug;
		}

		setAttributes({...newAttrs});
	}

	const onNext = () => {
		// check if blockAreaSlug is empty if so then move on to block-area-create
		if ('block-area-search' === activeStep && !blockAreaSlug) {
			setActiveStep('block-area-create');
			return;
		}
		// check if blockAreaSlug is empty still and activeStep is block-area-create, if so then return early...
		if ('block-area-create' === activeStep && !newBlockAreaName ) {
			return;
		}
		// check if categorySlug is empty if so then move on to category-search-select
		if (['block-area-create','block-area-search'].includes(activeStep) && (!categorySlug || !inheritCategory)) {
			setActiveStep('category-search-select');
			return;
		}

		if (['category-search-select'].includes(activeStep) && (categorySlug || inheritCategory)) {
			setActiveStep('review-phase');
			return;
		}
	}

	const onPrevious = () => {
		// if activeStep is block-area-create then move back to block-area-search
		if ('block-area-create' === activeStep) {
			setActiveStep('block-area-search');
			return;
		}
		// if categorySlug is empty and activeStep is category-search-select then move back to block-area-create
		if ('category-search-select' === activeStep) {
			setActiveStep('block-area-create');
			return;
		}
		if ( 'review-phase' === activeStep ) {
			setActiveStep('category-search-select');
			return;
		}
	}

	return (
		<Placeholder
			label={__('Block Area Setup', 'prc-platform-core')}
			instructions={INSTRUCTIONS[STEPS.indexOf(activeStep)]}
			isColumnLayout={true}
			icon={icon}
		>
			<PlaceholderInner>
				{'block-area-search' === activeStep && (
					<BlockAreaSearch {...{
						blockAreaSlug,
						setBlockAreaSlug,
					}}/>
				)}
				{'block-area-create' === activeStep && (
					<BlockAreaCreate {...{
						blockAreaName: newBlockAreaName,
						onCreation: (newName) => {
							console.log('newBlockarea', newName);
							setNewBlockAreaName(newName);
						}
					}}/>
				)}
				{'category-search-select' === activeStep && (
					<CategorySearchSelect {...{
						categorySlug,
						templateSlug: context?.templateSlug,
						inheritCategory,
						onInheritChange: (inherit) => setInheritCategory(inherit),
						onCategoryChange: (slug) => inheritCategory ? setCategorySlug(null) : setCategorySlug(slug),
					}}/>
				)}
				{'review-phase' === activeStep && (
					<PlaceholderWizardSummary {...{
						blockAreaSlug,
						categorySlug,
						newBlockAreaName,
						inheritCategory,
					}}/>
				)}
				<Toolbar>
					<Button
						variant="secondary"
						onClick={() => onPrevious()}
					>
						Back
					</Button>
					{'review-phase' === activeStep && (
						<Button variant="primary" onClick={allowCompletion ? onFinish : () => {
							console.warn('PlaceholderWizardSummary onFinish - not allowed');
						}}
						disabled={!allowCompletion}
						>
							Finish
						</Button>
					)}
					{'review-phase' !== activeStep && (
						<Button
							variant="secondary"
							onClick={() => onNext()}
							disabled={!allowNext}
						>
							Next
						</Button>
					)}
				</Toolbar>
			</PlaceholderInner>
		</Placeholder>
	);
}
