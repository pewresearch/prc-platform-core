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
	useEffect(() => {
		if (records?.length === 0 || !hasResolved) {
			return;
		}
		if (!previewedHomepageId) {
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
