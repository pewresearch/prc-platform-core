/* eslint-disable max-lines-per-function */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * External Dependencies
 */
import { tool as icon } from '@wordpress/icons';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Placeholder,
	SelectControl,
	Button,
	Flex,
	FlexBlock,
	FlexItem,
} from '@wordpress/components';
import { Fragment, useState, useMemo } from '@wordpress/element';
import { useBlockProps, Warning } from '@wordpress/block-editor';

/**
 * Internal Dependencies
 */
import useFeaturesList from './use-features-list';
import DataDropZone from './data-drop-zone';

function findFeatureBySlug(obj, slug) {
	for (const key in obj) {
		if (typeof obj[key] === 'object') {
			const result = findFeatureBySlug(obj[key], slug);
			if (result) {
				return result;
			}
		} else if (obj.hasOwnProperty('slug') && obj.slug === slug) {
			return obj;
		}
	}
	return null;
}

export default function Edit({ attributes, setAttributes, clientId, context }) {
	const { postId } = context;
	const blockProps = useBlockProps();
	const [dataViewerOpen, setDataViewerOpen] = useState(false);
	const {
		slug,
		year,
		researchArea,
		dataAttachmentId,
		legacyWpackIo,
		legacyAssetsS3,
	} = attributes;

	const isLegacy = useMemo(() => {
		return legacyWpackIo || legacyAssetsS3;
	}, [legacyWpackIo, legacyAssetsS3]);

	const { features } = useFeaturesList();

	const selectedFeature = useMemo(() => {
		if (features && slug) {
			return findFeatureBySlug(features, slug);
		}
		return null;
	}, [features, slug]);

	const placeholderLabel = useMemo(() => {
		return selectedFeature?.title || __('Select Feature');
	}, [selectedFeature]);

	const researchAreaOptions = useMemo(() => {
		const defaultValue = { label: 'Select Research Area', value: null };
		const options = [defaultValue];
		if (null !== features && Object.keys(features).length > 0) {
			Object.keys(features).forEach((researchAreaSlug) => {
				// const label which is researchArea but with the first letter capitalized
				const label =
					researchAreaSlug.charAt(0).toUpperCase() +
					researchAreaSlug.slice(1);
				options.push({
					label,
					value: researchAreaSlug,
				});
			});
		}
		return options;
	}, [features]);

	const yearOptions = useMemo(() => {
		const defaultValue = { label: 'Select Year', value: null };
		const options = [defaultValue];
		if (
			null !== features &&
			Object.keys(features).length > 0 &&
			researchArea
		) {
			Object.keys(features[researchArea]).forEach((yr) => {
				options.push({
					label: yr,
					value: yr,
				});
			});
		}
		return options;
	}, [features, researchArea]);

	const filteredFeatureOptions = useMemo(() => {
		const defaultValue = { label: 'Select Feature', value: null };
		// filter features[researchArea][year]
		if (null === researchArea || null === year) {
			return [defaultValue];
		}
		const data = features?.[researchArea]?.[year];
		if (!data) {
			return [defaultValue];
		}
		const options = data.map((feature) => {
			// get the slug from data by index and store as a const
			return {
				label: feature.title,
				value: feature.slug,
			};
		});
		options.unshift(defaultValue);
		return options;
	}, [features, researchArea, year]);

	return (
		<div {...blockProps}>
			{isLegacy && (
				<Warning>
					<p>
						This feature is being loaded via legacy means:{' '}
						<strong>
							{undefined !== legacyWpackIo
								? 'WPackIo'
								: 'Assets S3'}
						</strong>
						.
					</p>
					<p>
						Please update this feature&apos;s code and bring it into{' '}
						<i>/features</i> and up to <i>@wordpress/scripts</i>{' '}
						compliance at earliest convenience
					</p>
					<Button
						isDestructive
						variant="primary"
						onClick={() =>
							setAttributes({
								slug: null,
								legacyAssetsS3: null,
								legacyWpackIo: null,
							})
						}
						text="Reset Feature Selection"
					/>
				</Warning>
			)}
			{!isLegacy && (
				<Placeholder label={placeholderLabel} icon={icon}>
					{null === selectedFeature && (
						<Flex gap="5px">
							<FlexItem>
								<SelectControl
									label="Select Research Area"
									value={researchArea}
									options={researchAreaOptions}
									onChange={(value) => {
										setAttributes({ researchArea: value });
									}}
								/>
							</FlexItem>
							<FlexItem>
								<SelectControl
									label="Select Year"
									value={year}
									options={yearOptions}
									onChange={(value) => {
										setAttributes({ year: value });
									}}
								/>
							</FlexItem>
							<FlexBlock>
								<SelectControl
									label="Select Feature"
									value={slug}
									disabled={
										filteredFeatureOptions.length === 0
									}
									options={filteredFeatureOptions}
									onChange={(value) => {
										setAttributes({ slug: value });
									}}
								/>
							</FlexBlock>
						</Flex>
					)}
					{selectedFeature && (
						<div>
							<Button
								variant="secondary"
								onClick={() => setAttributes({ slug: null })}
								text="Reset Feature Selection"
							/>
							<DataDropZone
								{...{
									id: dataAttachmentId,
									setNewId: (id) => {
										setAttributes({ dataAttachmentId: id });
									},
								}}
							>
								<p>Data accessible via Rest API:</p>
								<p>
									<pre>
										/wp-json/prc-api/v3/feature/get-data/
										{`${dataAttachmentId}`}
									</pre>
								</p>
							</DataDropZone>
						</div>
					)}
				</Placeholder>
			)}
		</div>
	);
}
