/**
 * External Dependencies
 */
import { List } from 'react-movable';
import { randomId } from '@prc-app/shared';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { Button, PanelBody } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import './store';
import Item from './item';
import { TypeSelect } from './type-select';
import { useEffect } from 'react';

const ReportMaterials = () => {
	const [popoverVisible, toggleVisibility] = useState(false);
	const { append, reorder } = useDispatch('prc/report');

	// Initial load of report materials.
	const { items } = useSelect((select) => {
		return {
			items: select('prc/report').getItems(),
		};
	}, []);

	return (
		<PanelBody title="Materials">
			<List
				lockVertically
				values={items}
				onChange={({ oldIndex, newIndex }) =>
					reorder({
						from: oldIndex,
						to: newIndex,
					})
				}
				renderList={({ children, props }) => (
					<div {...props}>{children}</div>
				)}
				renderItem={({ value, props, index }) => (
					<div {...props}>
						<Item
							key={value.key}
							type={value.type}
							url={value.url}
							label={value.label}
							icon={value.icon}
							attachmentId={value.attachmentId}
							index={index}
						/>
					</div>
				)}
			/>
			<Button
				isPrimary
				onClick={() => {
					toggleVisibility(true);
				}}
			>
				{__('Add Report Material')}
			</Button>
			{popoverVisible && (
				<TypeSelect
					onChange={(t) => {
						append({
							key: randomId(),
							type: t,
							attachmentId: 0,
							url: '',
							label: '',
							icon: '',
						});
						toggleVisibility(false);
					}}
					toggleVisibility={toggleVisibility}
				/>
			)}
		</PanelBody>
	);
};

export default ReportMaterials;
