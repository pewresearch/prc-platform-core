/**
 * External Dependencies
 */
import { useDebounce } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { Modal, ButtonGroup, Button, Spinner, TextControl } from '@wordpress/components';
import { getQueryArg } from '@wordpress/url';

const { api } = window.wp;

const PostSearchByEditUrlField = ({
    hocOnChange = false,
}) => {
    const [modalOpen, toggleModal] = useState(false);
    const [isLoading, toggleLoading] = useState(false);
    const [postTitle, setPostTitle] = useState();
    const [searchValue, setSearchValue] = useState();
    const postUrl = useDebounce(searchValue, 1000);
    const [searchResult, setSearchResult] = useState(false);

    const confirm = () => {
        const {id} = searchResult;
        // Do one last double check
        const post = new api.models.Post( { id } );
        post.fetch().then((matched) => {
            if ( matched.id === searchResult.id ) {
                toggleModal(false);
                setSearchResult(false);
                if ( false !== hocOnChange ) {
                    hocOnChange(matched.id);
                }
            } else {
                alert('Uhoh, somethings wrong here. The expected post id does not match the given id.');
            }
        });
    }

    const deny = () => {
        setSearchValue('');
        setSearchResult(false);
    }

    const fetchPostByEditURL = (val) => {
        const postId = getQueryArg(val, 'post');
		console.log('fetchPostByEditURL', val);
        const post = new api.models.Post( { id: postId } );
        post.fetch().then((matched) => {
            console.log('matched?', matched);
            setPostTitle(matched.title.rendered);
            setSearchResult(matched);
            toggleModal(true);
        }).always(()=>{
            toggleLoading(false);
        });
    };

    // const getPostTitleById = (id) => {
    //     const post = new api.models.Post( { id } );
    //     post.fetch().then((matched) => {
    //         setPostTitle(matched.title.rendered);
    //     });
    // }

    useEffect(()=>{
		console.log('postUrl', postUrl);
        if ( undefined !== postUrl && 3 <= postUrl.length ) {
            fetchPostByEditURL(postUrl);
        }
    }, [postUrl]);

    return (
        <Fragment>
            <div style={{display: 'flex', flexDirection:'row'}}>
                <div style={{flexGrow: '1'}}>
                    <TextControl autoComplete="off" onChange={ val => { toggleLoading(true); setSearchValue(val); }} placeholder="Paste post's edit url..."/>
                </div>
                <div>
                    {isLoading && <Spinner/>}
                </div>
            </div>
            { true === modalOpen && (
                <Modal
					title={__('Confirm Post', 'prc-platform-post-report-package')}
					onRequestClose={()=>{toggleModal(false)}}
				>
                    <p>Add <strong>{decodeEntities(postTitle)}</strong> post as child?</p>
                    <ButtonGroup>
                        <Button variant="secondary" onClick={deny}>
                            No
                        </Button>
                        <Button variant="primary" onClick={confirm}>
                            Yes
                        </Button>
                    </ButtonGroup>
                </Modal>
            )}
        </Fragment>

    );
};

export default PostSearchByEditUrlField;
