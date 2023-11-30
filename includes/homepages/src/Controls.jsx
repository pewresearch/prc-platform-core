/* eslint-disable @wordpress/i18n-no-variables */
/* eslint-disable @wordpress/i18n-no-collapsible-whitespace */
/* eslint-disable max-lines-per-function */
/* eslint-disable @wordpress/no-base-control-with-label-without-id */
/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	BaseControl,
	Button,
} from '@wordpress/components';
import { useEntityRecord, useEntityRecords } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';

// get today's date in MM/DD/YYYY format
const today = new Date().toLocaleDateString('en-US', {
	month: '2-digit',
	day: '2-digit',
	year: '2-digit',
});

export default function Controls({
	currentHomepageId,
	setPreviewedHomepageId,
	isMissing,
}) {
	const [selectValue, setSelectValue] = useState('');
	const { record, hasResolved } = useEntityRecord(
		'postType',
		'homepage',
		currentHomepageId
	);

	const queryArgs = {
		per_page: 5,
		context: 'view',
		orderby: 'date',
		order: 'desc',
		status: 'draft',
	};

	const { records, hasResolved: recordsHasResolved } = useEntityRecords(
		'postType',
		'homepage',
		queryArgs
	);

	return (
		<InspectorControls>
			<PanelBody>
				{isMissing && (
					<PanelRow>
						<div>
							{__(
								'No homepage found. Please create a homepage.',
								'prc-platform-homepages'
							)}
						</div>
					</PanelRow>
				)}

				{hasResolved && !isMissing && (
					<PanelRow>
						<BaseControl
							__nextHasNoMarginBottom
							label="Active Homepage"
							style={{
								width: '100%',
							}}
						>
							<div>
								<strong>{record?.title.raw}</strong>
							</div>
						</BaseControl>
					</PanelRow>
				)}
				{recordsHasResolved && !isMissing && (
					<>
						<PanelRow>
							<SelectControl
								style={{
									width: '100%',
								}}
								label={__(
									'Preview draft homepages',
									'prc-platform-homepages'
								)}
								value={selectValue}
								options={[
									{
										disabled: true,
										label: 'Select a homepage draft',
										value: '',
									},
								].concat(
									records.map((rec) => {
										return {
											label: `${new Date(
												rec.date
											).toLocaleDateString('en-US', {
												month: '2-digit',
												day: '2-digit',
												year: '2-digit',
											})} – ${rec.title.rendered}`,
											value: rec.id,
										};
									})
								)}
								onChange={(value) => {
									setPreviewedHomepageId(value);
									setSelectValue(value);
								}}
							/>
						</PanelRow>
						{selectValue && selectValue !== currentHomepageId && (
							<PanelRow>
								<Button
									variant="secondary"
									onClick={() => {
										setPreviewedHomepageId(
											currentHomepageId
										);
										setSelectValue('');
									}}
									style={{
										width: '100%',
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									Reset preview to active homepage
								</Button>
							</PanelRow>
						)}
					</>
				)}
				<PanelRow>
					<Button
						variant="primary"
						href={addQueryArgs('post-new.php', {
							post_type: 'homepage',
							post_title: __(
								`New Homepage ${today} (DRAFT)`,
								'prc-platform-homepages'
							),
						})}
						style={{
							width: '100%',
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						{__('Create a new homepage', 'prc-platform-homepages')}
					</Button>
				</PanelRow>
				{!hasResolved && <p>Loading homepage block controls...</p>}
			</PanelBody>
		</InspectorControls>
	);
}
