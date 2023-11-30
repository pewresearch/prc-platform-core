/**
 * External Dependencies
 */
import { WPEntitySearch } from '@prc/components';
import { useDebounce } from '@prc/hooks';
import { useTaxonomy } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { Button, TextControl } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import Step from './_step';
import { TAXONOMY, TAXONOMY_LABEL } from '../../constants';

const CreateNewButton = ({setButtonState, buttonState, setCreateNewBlockArea}) => {
	useEffect(() => {
		setButtonState({
			...buttonState,
			text: 'Create New Block Area',
			disabled: false,
			onClick: () => setCreateNewBlockArea(true),
		});
	}, []);

	return(
		<span>No Block Area could be found with that name, please create a new one.</span>
	);
};

const CreateNewField = ({setNewBlockAreaName, setNextStep, setButtonState, buttonState}) => {
	const [newBlockAreaName, setBlockAreaName] = useState('');
	const debouncedBlockAreaName = useDebounce(newBlockAreaName, 500);

	useEffect(() => {
		if (debouncedBlockAreaName.length < 3) {
			setButtonState({
				...buttonState,
				disabled: true,
			});
		} else {
			setButtonState({
				...buttonState,
				text: 'Continue...',
				disabled: false,
				onClick: () => {
					setNewBlockAreaName(debouncedBlockAreaName);
					setNextStep('query-b');
				},
			});
		}
	}, [debouncedBlockAreaName]);

	return(
		<TextControl
			label={__('New Block Area Name', 'prc-platform-core')}
			value={newBlockAreaName}
			onChange={( value ) => setBlockAreaName( value )}
		/>
	);
}

/**
 * Search for a block area,
 * @param {*} param0
 * @returns
 */
export default function QueryA({
	blockAreaSlug,
	setBlockAreaSlug,
	setNewBlockAreaName,
	setNextStep,
	buttonState,
	setButtonState,
}) {
	const [tempBlockAreaSlug, setTempBlockAreaSlug] = useState(blockAreaSlug);
	const [blockAreaId, blockAreaName] = useTaxonomy(TAXONOMY, blockAreaSlug);

	const [createNewBlockArea, setCreateNewBlockArea] = useState(false);

	useEffect(()=>{
		const buttonArgs = {
			...buttonState,
			text: 'Next',
			disabled: true,
			onClick: () => {
				setBlockAreaSlug(tempBlockAreaSlug);
				setNextStep('query-b');
			}
		};
		if (tempBlockAreaSlug && tempBlockAreaSlug.length > 0) {
			buttonArgs.disabled = false;
		}
		setButtonState(buttonArgs);
	}, [tempBlockAreaSlug]);

	return (
		<Step>
			{false === createNewBlockArea && (
				<WPEntitySearch
					placeholder={__('Search for an existing block area, or create a new one', 'prc-platform-core')}
					searchLabel={__(`Search for ${TAXONOMY_LABEL}`)}
					entityType="taxonomy"
					entitySubType={TAXONOMY}
					entityId={blockAreaId || false}
					searchValue={blockAreaName || ''}
					onSelect={(entity) => {
						console.log('Block Area Entity: ', entity);
						setTempBlockAreaSlug(entity.slug);
					}}
					onKeyEnter={() => {
						console.log("Enter Key Pressed");
					}}
					onKeyESC={() => {
						console.log("ESC Key Pressed");
					}}
					perPage={10}
					showExcerpt={true}
					createNew={() => {
						return(
							<CreateNewButton {...{buttonState, setButtonState, setCreateNewBlockArea}}/>
						);
					}}
				/>
			)}

			{true === createNewBlockArea && (
				<CreateNewField {...{setNewBlockAreaName, setNextStep, setButtonState, buttonState}}/>
			)}
		</Step>
	);
}
