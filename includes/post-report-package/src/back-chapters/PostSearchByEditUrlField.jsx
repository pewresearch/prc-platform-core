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

/**
 * Internal Dependencies
 */
import AddChildModal from './AddChildModal';
import CreateDraftModal from './CreateDraftModal';

const { api } = window.wp;

const PostSearchByEditUrlField = ({
    hocOnChange = false,
}) => {
	const { parentTitle, getEntityRecord } = useSelect((select) => {
		return {
			parentTitle: select('core/editor').getEditedPostAttribute('title'),
			getEntityRecord: select('core').getEntityRecord,
		}
	});
    const [addChildModalOpen, toggleAddChildModal] = useState(false);
	const [createDraftModalOpen, toggleCreateDraftModal] = useState(false);
    const [isLoading, toggleLoading] = useState(false);
    const [childTitle, setChildTitle] = useState();
    const [searchValue, setSearchValue] = useState();
	const [matched, setMatched] = useState();
    const postUrl = useDebounce(searchValue, 1000);
    const [searchResult, setSearchResult] = useState(false);

    const fetchPostByEditURL = (val) => {
        const postId = getQueryArg(val, 'post');
		const post = getEntityRecord('postType', 'post', postId);
		console.log('post', post);
        if ( undefined !== post ) {
			setChildTitle(post?.title?.rendered);
            setSearchResult(post);
            toggleAddChildModal(true);
		}
    };

    useEffect(()=>{
        if ( undefined !== postUrl && 3 <= postUrl.length ) {
			console.log('postUrl', postUrl);
            fetchPostByEditURL(postUrl);
        }
    }, [postUrl]);

    return (
        <Fragment>
            <div style={{display: 'flex', flexDirection:'row'}}>
                <div style={{flexGrow: '1'}}>
					<SearchControl
						value={searchValue}
						onChange={(val) => {
							toggleLoading(true);
							setSearchValue(val);
						}}
						placeholder={__(`Paste Back Chatper's edit (.../wp-admin/post.php?post=) url...`, 'prc-platform-post-report-package')}
						autoComplete="off"
					/>
                </div>
                <div>
                    {isLoading && <Spinner/>}
                </div>
            </div>
			<Button variant="tertiary" onClick={() => {toggleCreateDraftModal(true)}}>
				{__('Create New Draft', 'prc-platform-post-report-package')}
			</Button>
			{ true === createDraftModalOpen && (
				<CreateDraftModal
				{...{
					toggleCreateDraftModal,
					parentTitle,
					onConfirm: () => {
						console.log("CREATE DRAFT!");
						toggleCreateDraftModal(false);
						// if ( false !== hocOnChange ) {
						// 	hocOnChange(id);
						// }
					},
					onDeny: () => {
						toggleCreateDraftModal(false);
					},
				}}
				/>
			)}
            { true === addChildModalOpen && (
                <AddChildModal
				{...{
					toggleAddChildModal,
					parentTitle,
					childTitle,
					onConfirm: () => {
						const {id} = searchResult;
						toggleModal(false);
						setSearchResult(false);
						if ( false !== hocOnChange ) {
							hocOnChange(id);
						}
					},
					onDeny: () => {
						() => {
							setSearchValue('');
							setSearchResult(false);
						}
					},
				}}
				/>
            )}
        </Fragment>

    );
};

export default PostSearchByEditUrlField;
