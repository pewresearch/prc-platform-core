/**
 * External Dependencies
 */
import styled from '@emotion/styled';
import { useDebounce } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { useMemo, useState } from 'react';
import { useEntityRecords } from '@wordpress/core-data';
import { __, sprintf } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { parse } from '@wordpress/blocks';
import { useAsyncList } from '@wordpress/compose';
import { __experimentalBlockPatternsList as BlockPatternsList } from '@wordpress/block-editor';
import {
	SearchControl,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	Modal,
} from '@wordpress/components';

const ModalContent = styled.div`
	width: 80vw;
	.block-editor-block-patterns-list {
		column-count: 3;
		.block-editor-block-patterns-list__list-item {
			break-inside: avoid-column !important;
		}
	}
`;

const ModalSearch = styled.div`
	background: white;
	position: sticky;
	top: 0;
	z-index: 100;
	input:focus {
		box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
	}
`;

/**
 * Uses the useEntityRecords hook to query for a entity.
 * @param {*}       param0
 * @param {string}  param0.entityType - the post type of the entity.
 * @param {boolean} param0.enabled    - whether or not the query should be enabled.
 * @param {number}  param0.excludeId  - the id of the entity to exclude from the query.
 * @param {Object}  param0.args       - the args to pass to the query.
 * @return
 */
function useQuery({
	entityType = 'post',
	enabled = false,
	excludeId = null,
	args = {},
}) {
	const queryArgs = {
		context: 'view',
		orderby: 'date',
		order: 'desc',
		per_page: 25,
	};

	const { hasResolved, isResolving, records, status } = useEntityRecords(
		'postType',
		entityType,
		{ ...queryArgs, ...args },
		{ enabled }
	);

	// Filter out any block modules that have the same id as the excluded block module.
	const filteredRecords = useMemo(() => {
		if (!records) {
			return [];
		}
		return records.filter((record) => record.id !== excludeId) || [];
	}, [records, excludeId]);

	return {
		records: filteredRecords,
		isResolving,
		hasResolved,
	};
}

/**
 * Renders a modal with the <BlockPatternsList /> component to select a entity from a block based entity list. It is important that your entity be of a `post` type and it's contents comprised of blocks.
 * @param {Object}   props
 * @param {string}   props.title           - the title of the modal.
 * @param {string}   props.instructions    - the instructions for the modal.
 * @param {string}   props.entityType      - the post type of the entity.
 * @param {string}   props.entityTypeLabel - the label of the post type.
 * @param {Function} props.onSelect        - a function that will be called when the user selects a entity.
 * @param {Function} props.onClose         - a function that will be called when the user closes the modal.
 * @param {number}   props.selectedId      - the id of the selected entity.
 * @param {string}   props.clientId        - the client id of the block.
 * @return {Object} The entity pattern modal component.
 */
export default function EntityPatternModal({
	title,
	instructions,
	entityType = 'post',
	entityTypeLabel = 'Post',
	onSelect = () => {},
	onClose = () => {},
	selectedId = null,
	status = 'publish',
	clientId,
}) {
	const [searchValue, setSearchValue] = useState(null);
	const debouncedSearchValue = useDebounce(searchValue, 600);

	const { records, isResolving, hasResolved } = useQuery({
		entityType,
		enabled: true,
		excludeId: selectedId,
		args: {
			per_page: 50,
			context: 'edit',
			status,
		},
	});

	// We can map block modules, like template parts, to block patterns to reuse the BlockPatternsList UI
	const filteredRecords = useMemo(() => {
		const recordsAsPatterns = records.map((record) => ({
			id: record.id,
			name: record.slug,
			title: record.title.rendered,
			blocks: parse(record.content.raw),
			content: record.content.raw,
		}));

		// Filter only the block modules that have title and content that match the search value
		return recordsAsPatterns.filter((record) => {
			if (!debouncedSearchValue) {
				return true;
			}
			return (
				record.title.toLowerCase().includes(debouncedSearchValue) ||
				record.content.includes(debouncedSearchValue)
			);
		});
	}, [records, debouncedSearchValue]);

	const shownRecords = useAsyncList(filteredRecords);

	const { createSuccessNotice } = useDispatch(noticesStore);

	const onPatternSelect = (response) => {
		console.log('onPatternSelect', response);
		const { title } = response;

		onSelect(response);

		createSuccessNotice(
			sprintf(
				/* translators: %s: template part title. */
				__('%s "%s" inserted.'),
				entityTypeLabel,
				title
			),
			{
				type: 'snackbar',
			}
		);

		onClose();
	};

	// const createFromBlocks = useCreateTemplatePartFromBlocks(setAttributes);

	const hasRecords = !!filteredRecords.length;

	return (
		<Modal title={title} onRequestClose={onClose}>
			<ModalContent>
				<VStack spacing="5">
					<ModalSearch>
						<SearchControl
							__nextHasNoMarginBottom
							onChange={setSearchValue}
							value={searchValue}
							label={`Search for ${entityTypeLabel}`}
							placeholder={__('Search')}
						/>
					</ModalSearch>

					{hasRecords && (
						<div>
							<h2>{`Existing ${entityTypeLabel}`}</h2>
							{instructions && <p>{instructions}</p>}
							<BlockPatternsList
								blockPatterns={filteredRecords}
								shownPatterns={shownRecords}
								onClickPattern={(pattern) => {
									onPatternSelect(pattern);
								}}
							/>
						</div>
					)}

					{!hasRecords && (
						<HStack alignment="center">
							<p>{__('No records found.')}</p>
						</HStack>
					)}
				</VStack>
			</ModalContent>
		</Modal>
	);
}
