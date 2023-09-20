/**
 * External Dependencies
 */
import { List } from 'react-movable';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, PanelBody } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { randomId } from '../utils';
import { usePostReportPackage } from '../context';
import Item from './Item';
import { TypeSelect } from './type-select';

function ReportMaterials() {
	const [popoverVisible, toggleVisibility] = useState(false);

	const ITEMS_TYPE = 'materials';
	const { materials, reorder, append, remove, updateItem, isResolving } = usePostReportPackage();

	return (
		<PanelBody title="Materials">
			<List
				lockVertically
				values={materials ?? []}
				onChange={({ oldIndex, newIndex }) =>
					reorder(oldIndex, newIndex, ITEMS_TYPE)
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
				variant="primary"
				onClick={() => {
					toggleVisibility(true);
				}}
			>
				{__('Add Report Material')}
			</Button>
			{popoverVisible && (
				<TypeSelect
					onChange={(t) => {
						append(
							randomId(),
							{
								type: t,
								url: '',
								attachmentId: 0,
								label: '',
								icon: '',
							},
							ITEMS_TYPE
						);
						toggleVisibility(false);
					}}
					toggleVisibility={toggleVisibility}
				/>
			)}
		</PanelBody>
	);
};

export default ReportMaterials;
