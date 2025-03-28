/* eslint-disable max-lines */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-lines-per-function */
/**
 * External Dependencies
 */
import { List, arrayMove, arrayRemove } from 'react-movable';
import styled from '@emotion/styled';
/**
 * Wordpress Dependencies
 */
import { useState, useRef, Fragment } from 'react';
import { __ } from '@wordpress/i18n';
import {
	__experimentalInputControl as InputControl,
	Button,
	DropZone,
	PanelRow,
	Popover,
} from '@wordpress/components';

import { Icon } from '@prc/icons';

import handleCSV from './csv-parser';

const PopoverControls = ({ children }) => {
	const [visible, setVisible] = useState(false);
	return (
		<Button style={{ width: '100%' }} onClick={() => setVisible(!visible)}>
			<Icon icon="ellipsis-vertical" />
			{visible && (
				<Popover placement="top-end">
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							width: '200px',
						}}
					>
						{children}
					</div>
				</Popover>
			)}
		</Button>
	);
};

function Sorter({
	options,
	setAttributes,
	attribute,
	onChange,
	clientId,
	canEdit,
	isRemovable,
	hasSetActive,
}) {
	const [items, setItems] = useState(options);
	const [inputValue, setInputValue] = useState('');
	const hiddenFileInput = useRef(null);

	const handleUpdate = (newItems, oldIndex, newIndex) => {
		if (typeof onChange === 'function') {
			onChange(newItems, oldIndex, newIndex);
		} else if (typeof setAttributes === 'function') {
			setAttributes({
				[attribute]: newItems.map((i) => ({
					label: i.label,
					value: i.value,
					isActive: i.isActive || false,
					disabled: i.disabled || false,
				})),
			});
		}
	};

	return (
		<Fragment>
			<PanelRow>
				<List
					values={items}
					onChange={({ oldIndex, newIndex }) => {
						const newItems = arrayMove(items, oldIndex, newIndex);
						setItems(newItems);
						// check if onChange is a function
						handleUpdate(newItems, oldIndex, newIndex);
					}}
					renderList={({ children, props, isDragged }) => (
						<StyledTable isDragged={isDragged}>
							<thead>
								<tr>
									<th>Label</th>
									<th>Value</th>
									<th></th>
								</tr>
							</thead>
							<tbody {...props}>{children}</tbody>
						</StyledTable>
					)}
					renderItem={({
						value,
						props,
						index,
						isDragged,
						isSelected,
					}) => {
						const row = (
							<StyledRow
								{...props}
								key={props.key}
								isDragged={isDragged}
								isSelected={isSelected}
							>
								<td>
									{/* TODO: Might be some time where we want to incorportate
										the canEdit prop to determine if the user can edit the
										label or not. For now, we'll just allow it.
									*/}
									<InputControl
										name="label"
										value={value.label}
										disabled={value.disabled}
										onChange={(val) => {
											items[index].label = val;
											const newItems = arrayMove(
												items,
												index,
												index
											);
											setItems(newItems);
											handleUpdate(
												newItems,
												index,
												index
											);
										}}
									/>
								</td>
								<td>
									<InputControl
										name="value"
										value={value.value}
										disabled={value.disabled}
										onChange={(val) => {
											items[index].value = val;
											const newItems = arrayMove(
												items,
												index,
												index
											);
											setItems(newItems);
											handleUpdate(
												newItems,
												index,
												index
											);
										}}
									/>
								</td>
								<td style={{ textAlign: 'center' }}>
									<PopoverControls>
										<Button
											type="button"
											onClick={({
												oldIndex,
												newIndex,
											}) => {
												items[index].disabled =
													!items[index].disabled;
												const newItems = arrayMove(
													items,
													oldIndex,
													newIndex
												);
												setItems(newItems);
												handleUpdate(
													newItems,
													oldIndex,
													newIndex
												);
											}}
										>
											{!value.disabled ? (
												<IconSpan>
													Item is visible{' '}
													<Icon icon="eye" />
												</IconSpan>
											) : (
												<IconSpan>
													Item is hidden{' '}
													<Icon icon="eye-slash" />
												</IconSpan>
											)}
										</Button>

										{hasSetActive && (
											<Button
												onClick={({
													oldIndex,
													newIndex,
												}) => {
													items[index].isActive =
														!items[index].isActive;
													const newItems = arrayMove(
														items,
														oldIndex,
														newIndex
													);
													setItems(newItems);
													handleUpdate(
														newItems,
														oldIndex,
														newIndex
													);
												}}
											>
												{value.isActive ? (
													<IconSpan>
														Item is active{' '}
														<Icon icon="check" />
													</IconSpan>
												) : (
													<IconSpan>
														Item is not active{' '}
														<Icon icon="xmark" />
													</IconSpan>
												)}
											</Button>
										)}
										{isRemovable && (
											<Button
												isDestructive
												onClick={({
													oldIndex,
													newIndex,
												}) => {
													const newItems =
														arrayRemove(
															items,
															index
														);
													setItems(newItems);
													handleUpdate(
														newItems,
														oldIndex,
														newIndex
													);
												}}
											>
												<IconSpan>
													Remove Item{' '}
													<Icon icon="trash" />
												</IconSpan>
											</Button>
										)}
									</PopoverControls>
								</td>
							</StyledRow>
						);
						return isDragged ? (
							<StyledTable isDragged={isDragged}>
								<tbody>{row}</tbody>
							</StyledTable>
						) : (
							row
						);
					}}
				/>
			</PanelRow>
			<PanelRow>
				{/*
			@TODO: InputControl doesn't yet have an onEnter event.
			Ideally keying enter on your keyboard should update the
			list of options.
			*/}
				<InputControl
					style={{ width: '100%' }}
					value={inputValue}
					placeholder="A new option ..."
					isPressEnterToChange
					onChange={(val) => {
						setInputValue(val);
					}}
				/>
			</PanelRow>
			<PanelRow>
				<Button
					style={{ width: '100%', marginBottom: '24px' }}
					type="button"
					variant="secondary"
					onClick={() => {
						const formattedValue = inputValue
							.toLowerCase()
							.replace(/\s/g, '-')
							.replace(/[^a-zA-Z0-9-]/g, '');
						const newItems = [
							...items,
							{ label: inputValue, value: formattedValue },
						];
						setItems(newItems);
						if (typeof onChange === 'function') {
							onChange(newItems);
						} else if (typeof setAttributes === 'function') {
							setAttributes({
								[attribute]: newItems.map((i) => ({
									label: i.label,
									value: i.value,
								})),
							});
						}
						setInputValue('');
					}}
				>
					Add New Option
				</Button>
			</PanelRow>

			<PanelRow>
				<PanelDescription>
					Generating a select's options via CSV will take the first
					column of a CSV and generate them as the labels for their
					respsective options.
				</PanelDescription>
			</PanelRow>
			<PanelRow>
				<Button
					variant="primay"
					onClick={() => {
						hiddenFileInput.current.click();
					}}
				>
					{__(`Import options from CSV`, 'prc-block-library')}
				</Button>
				<input
					ref={hiddenFileInput}
					type="file"
					accept="text/csv"
					onChange={(e) => {
						handleCSV(
							e.target.files,
							attribute,
							setItems,
							setAttributes,
							onChange
						);
					}}
					style={{ display: 'none' }}
				/>
				<DropZone
					onFilesDrop={(droppedFiles) => {
						handleCSV(
							droppedFiles,
							attribute,
							setItems,
							setAttributes,
							onChange
						);
					}}
				/>
			</PanelRow>
			<PanelRow>
				<Button
					style={{ width: '100%' }}
					type="button"
					className="is-secondary is-destructive"
					onClick={() => {
						setItems([]);
						if (typeof onChange === 'function') {
							onChange([]);
						} else if (typeof setAttributes === 'function') {
							setAttributes({ [attribute]: [] });
						}
					}}
				>
					Remove All Options
				</Button>
			</PanelRow>
		</Fragment>
	);
}

export default Sorter;

const PanelDescription = styled.div`
	grid-column: span 2;
`;
const StyledTable = styled.table((props) => ({
	borderSpacing: 0,
	borderCollapse: 'collapse',
	width: '100%',
	textAlign: 'left',
	overflow: 'scroll',
	backgroundColor: '#FFF',
	boxShadow: props.isDragged ? '0 0 10px rgba(0,0,0,0.1)' : 'none',
	cursor: props.isDragged ? 'grabbing' : undefined,
	marginBottom: '24px',
}));

const StyledRow = styled.tr((props) => ({
	cursor: props.isDragged ? 'grabbing' : 'grab',
	backgroundColor: props.isDragged || props.isSelected ? '#EEE' : '#fff',
	'&:nth-of-type(odd)': {
		backgroundColor: '#F1F1F1',
	},
}));

const IconSpan = styled.span`
	width: 100%;
	display: flex;
	justify-content: space-between;
`;
