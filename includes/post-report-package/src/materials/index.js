/**
 * External Dependencies
 */
import { List } from 'react-movable';
import { LoadingIndicator } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';
import { Button, PanelBody } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { randomId } from '../utils';
import { usePostReportPackage } from '../context';
import Item from './item';
import { TypeSelect, getLabel } from './type-select';

export default function MaterialsPanel() {
	const [popoverVisible, toggleVisibility] = useState(false);

	const ITEMS_TYPE = 'materials';
	const {
		materials,
		reorder,
		append,
		remove,
		updateItem,
		isResolving,
		allowEditing,
	} = usePostReportPackage();

	return (
		<PanelBody title="Materials">
			<LoadingIndicator
				enabled={isResolving}
				label="Resolving Materials..."
			/>
			{!isResolving && (
				<Fragment>
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
									url={value?.url}
									label={value?.label}
									icon={value?.icon}
									attachmentId={value?.attachmentId}
									index={index}
								/>
							</div>
						)}
					/>
					<Button
						variant="primary"
						disabled={!allowEditing}
						onClick={() => {
							toggleVisibility(true);
						}}
					>
						{__('Add Material')}
					</Button>
					{popoverVisible && (
						<TypeSelect
							onChange={(t) => {
								const args = {
									type: t,
									url: '',
									label: getLabel(t),
									icon: '',
								};
								if (
									[
										'report',
										'questionnaire',
										'detailedTable',
										'powerpoint',
										'presentation',
										'pressRelease',
										'topline',
										'pormo',
									].includes(t)
								) {
									args.attachmentId = null;
								}
								append(randomId(), args, ITEMS_TYPE);
								toggleVisibility(false);
							}}
							toggleVisibility={toggleVisibility}
						/>
					)}
				</Fragment>
			)}
		</PanelBody>
	);
}
