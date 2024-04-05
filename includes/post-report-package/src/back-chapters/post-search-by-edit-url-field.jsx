/**
 * External Dependencies
 */
import { useDebounce } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { Button, SearchControl, Spinner } from '@wordpress/components';
import { getQueryArg } from '@wordpress/url';
import { useSelect } from '@wordpress/data';
import { useEntityRecord } from '@wordpress/core-data';

/**
 * Internal Dependencies
 */
import AddChildModal from './add-child-modal';
import CreateDraftModal from './create-draft-modal';

const PostSearchByEditUrlField = ({ hocOnChange = false }) => {
	const { parentTitle, parentId, getEntityRecord } = useSelect((select) => {
		return {
			parentTitle: select('core/editor').getEditedPostAttribute('title'),
			parentId: select('core/editor').getCurrentPostId(),
			getEntityRecord: select('core').getEntityRecord,
		};
	});
	const [targetPostId, setTargetPostId] = useState(null);
	const { record, isResolving } = useEntityRecord(
		'postType',
		'post',
		targetPostId,
		{ enabled: null !== targetPostId }
	);
	// const [post,] = getEntityRecord('postType', 'post', targetPostId, {enabled: false});
	const [addChildModalOpen, toggleAddChildModal] = useState(false);
	const [createDraftModalOpen, toggleCreateDraftModal] = useState(false);
	const [isLoading, toggleLoading] = useState(false);
	const [childTitle, setChildTitle] = useState();
	const [searchValue, setSearchValue] = useState();
	const [matched, setMatched] = useState();
	const postUrl = useDebounce(searchValue, 1000);
	const [searchResult, setSearchResult] = useState(false);

	useEffect(() => {
		if (undefined !== postUrl && 3 <= postUrl.length) {
			console.log('postUrl', postUrl);
			const postId = getQueryArg(postUrl, 'post');
			setTargetPostId(postId);
		}
	}, [postUrl]);

	useEffect(() => {
		if (undefined !== record && isResolving === false) {
			setChildTitle(record?.title?.rendered);
			setSearchResult(record);
			toggleAddChildModal(true);
		}
	}, [record, isResolving]);

	return (
		<Fragment>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div style={{ flexGrow: '1' }}>
					<SearchControl
						value={searchValue}
						onChange={(val) => {
							toggleLoading(true);
							setSearchValue(val);
						}}
						placeholder={__(
							`Paste Back Chatper's edit (…/wp-admin/post.php?post=) url…`,
							'prc-platform-post-report-package'
						)}
						autoComplete="off"
					/>
				</div>
				<div>{isLoading && <Spinner />}</div>
			</div>
			<Button
				variant="tertiary"
				onClick={() => {
					toggleCreateDraftModal(true);
				}}
			>
				{__('Create New Draft', 'prc-platform-post-report-package')}
			</Button>
			{true === createDraftModalOpen && (
				<CreateDraftModal
					{...{
						parentTitle,
						parentId,
						onConfirm: (newPostId) => {
							console.log('CREATE DRAFT!', newPostId);
							if (false !== hocOnChange) {
								hocOnChange(newPostId);
							}
						},
						onDeny: () => {
							toggleCreateDraftModal(false);
						},
					}}
				/>
			)}
			{true === addChildModalOpen && (
				<AddChildModal
					{...{
						toggleAddChildModal,
						parentTitle,
						childTitle,
						onConfirm: () => {
							const { id } = searchResult;
							toggleAddChildModal(false);
							setSearchResult(false);
							if (false !== hocOnChange) {
								hocOnChange(id);
							}
						},
						onDeny: () => {
							setSearchValue('');
							setSearchResult(false);
						},
					}}
				/>
			)}
		</Fragment>
	);
};

export default PostSearchByEditUrlField;
