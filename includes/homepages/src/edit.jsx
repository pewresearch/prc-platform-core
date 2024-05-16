/* eslint-disable @wordpress/i18n-no-variables */
/* eslint-disable @wordpress/i18n-no-collapsible-whitespace */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * External Dependencies
 */
import { InnerBlocksAsSyncedContent } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { Fragment, useMemo, useState, useEffect } from 'react';
import { useEntityRecords } from '@wordpress/core-data';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal Dependencies
 */
import Controls from './controls';
import { POST_TYPE, POST_TYPE_LABEL } from './constants';

export default function Edit({ clientId, context }) {
	const [previewedHomepageId, setPreviewedHomepageId] = useState();

	const queryArgs = {
		per_page: 1,
		context: 'view',
		orderby: 'date',
		order: 'desc',
	};

	const { records, hasResolved } = useEntityRecords(
		'postType',
		POST_TYPE,
		queryArgs
	);

	// This sets the previewed homepage ID to the first homepage record fetched from the API and updates it if the latest homepage has changed.
	useEffect(() => {
		if (records?.length === 0 || !hasResolved) {
			return;
		}
		// If there is no previewed homepage or the previewed homepage is different from the one that was just fetched, update the previewed homepage ID.
		if (records[0].id && previewedHomepageId !== records[0].id) {
			setPreviewedHomepageId(records[0].id);
		}
	}, [hasResolved, records, previewedHomepageId]);

	const blockProps = useBlockProps();

	return (
		<Fragment>
			<Controls
				{...{
					previewedHomepageId,
					setPreviewedHomepageId,
					clientId,
				}}
			/>
			<InnerBlocksAsSyncedContent
				{...{
					postId: previewedHomepageId,
					postType: POST_TYPE,
					postTypeLabel: POST_TYPE_LABEL,
					blockProps,
					clientId,
				}}
			/>
		</Fragment>
	);
}
