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
import useInteractivesList from './use-interactives-list';
import DataDropZone from './data-drop-zone';

function findInteractiveBySlug(obj, slug) {
	for (const key in obj) {
		if (typeof obj[key] === 'object') {
			const result = findInteractiveBySlug(obj[key], slug);
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
	const [researchArea, setResearchArea] = useState(null);
	const [year, setYear] = useState(null);
	const [dataViewerOpen, setDataViewerOpen] = useState(false);
	const { slug, dataAttachmentId, legacyWpackIo, legacyAssetsS3 } =
		attributes;

	const isLegacy = useMemo(() => {
		return legacyWpackIo || legacyAssetsS3;
	}, [legacyWpackIo, legacyAssetsS3]);

	const { interactives } = useInteractivesList(researchArea, year);

	const selectedInteractive = useMemo(() => {
		if (interactives && slug) {
			return findInteractiveBySlug(interactives, slug);
		}
		return null;
	}, [interactives, slug]);

	const placeholderLabel = useMemo(() => {
		return selectedInteractive?.title || __('Select Interactive');
	}, [selectedInteractive]);

	const researchAreaOptions = useMemo(() => {
		const defaultValue = { label: 'Select Research Area', value: null };
		const options = [defaultValue];
		if (interactives) {
			Object.keys(interactives).forEach((researchArea) => {
				// const label which is researchArea but with the first letter capitalized
				const label =
					researchArea.charAt(0).toUpperCase() +
					researchArea.slice(1);
				options.push({
					label,
					value: researchArea,
				});
			});
		}
		return options;
	}, [interactives]);

	const yearOptions = useMemo(() => {
		const defaultValue = { label: 'Select Year', value: null };
		const options = [defaultValue];
		if (interactives && researchArea) {
			Object.keys(interactives[researchArea]).forEach((year) => {
				options.push({
					label: year,
					value: year,
				});
			});
		}
		return options;
	}, [interactives, researchArea]);

	const filteredInteractiveOptions = useMemo(() => {
		const defaultValue = { label: 'Select Interactive', value: null };
		// filter interactives[researchArea][year]
		if (null === researchArea || null === year) {
			return [defaultValue];
		}
		const data = interactives?.[researchArea]?.[year];
		if (!data) {
			return [defaultValue];
		}
		const options = data.map((interactive) => {
			// get the slug from data by index and store as a const
			return {
				label: interactive.title,
				value: interactive.slug,
			};
		});
		options.unshift(defaultValue);
		return options;
	}, [interactives, researchArea, year]);

	return (
		<div {...blockProps}>
			{isLegacy && (
				<Warning>
					<p>
						This interactive is being loaded via legacy means:{' '}
						<strong>
							{undefined !== legacyWpackIo
								? 'WPackIo'
								: 'Assets S3'}
						</strong>
						.
					</p>
					<p>
						Please update this interactive's code and bring it into{' '}
						<i>/interactives</i> and up to <i>@wordpress/scripts</i>{' '}
						build and loading compliance at earliest convenience
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
						text="Reset Interactive Selection"
					/>
				</Warning>
			)}
			{!isLegacy && (
				<Placeholder label={placeholderLabel} icon={icon}>
					{null === selectedInteractive && (
						<Flex gap="5px">
							<FlexItem>
								<SelectControl
									label="Select Research Area"
									value={researchArea}
									options={researchAreaOptions}
									onChange={(value) => {
										setResearchArea(value);
									}}
								/>
							</FlexItem>
							<FlexItem>
								<SelectControl
									label="Select Year"
									value={year}
									options={yearOptions}
									onChange={(value) => {
										setYear(value);
									}}
								/>
							</FlexItem>
							<FlexBlock>
								<SelectControl
									label="Select Interactive"
									value={slug}
									disabled={
										filteredInteractiveOptions.length === 0
									}
									options={filteredInteractiveOptions}
									onChange={(value) => {
										setAttributes({ slug: value });
									}}
								/>
							</FlexBlock>
						</Flex>
					)}
					{selectedInteractive && (
						<div>
							<Button
								variant="secondary"
								onClick={() => setAttributes({ slug: null })}
								text="Reset Interactive Selection"
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
										/wp-json/prc-api/v3/interactive/get-data/
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
