/* eslint-disable max-lines-per-function */
/* eslint-disable camelcase */
/**
 * External Dependencies
 */
import { useDebounce } from '@prc/hooks';

/**
 * WordPress dependencies
 */
import {
	useState,
	useContext,
	createContext,
	useEffect,
	useMemo,
} from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const attachmentsContext = createContext();

const useProvideAttachments = ({ postId, postType, enabled }) => {
	const [postTitle, setPostTitle] = useState('');
	const [attachments, setAttachments] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const [processing, toggleProcessing] = useState(false);

	const updateAttachments = () => {
		const pId = parseInt(postId, 10);
		if ('number' === typeof pId && false === processing) {
			toggleProcessing(true);
			apiFetch({
				path: `/prc-api/v3/attachments-report/get/?postId=${postId}`,
			})
				.then((data) => {
					console.log('... data ...', data);
					const { postTitle, attachments } = data;
					console.log('Attachments?', attachments);
					setPostTitle(postTitle);
					setAttachments([...attachments]);
					toggleProcessing(false);
				})
				.catch((error) => {
					console.error(error);
				})
				.finally(() => {
					toggleProcessing(false);
				});
		}
	};

	// const mediaEditor = media({
	// 	title: 'Edit Attachments',
	// 	button: {
	// 		text: 'Update',
	// 	},
	// 	library: {
	// 		uploadedTo: postId,
	// 	},
	// });
	// // When the media library closes, refresh the attachments.
	// mediaEditor.on('close', () => {
	// 	updateAttachments();
	// });

	// const openMediaLibrary = () => {
	// 	mediaEditor.open();
	// };

	// const closeMediaLibrary = () => {
	// 	mediaEditor.close();
	// };

	/**
	 * When imageids change or on init update attachments.
	 */
	useEffect(() => {
		if (true === enabled && 'number' === typeof parseInt(postId, 10)) {
			updateAttachments();
		}
	}, [postId, enabled]);

	const loading = useMemo(() => {
		return processing;
	}, [processing]);

	return {
		postId,
		postType,
		postTitle,
		attachments,
		loading,
		searchTerm,
		debouncedSearchTerm,
		setSearchTerm,
	};
};

// Hook for child components to get the context object ...
// ... and re-render when it changes.
const useAttachments = () => useContext(attachmentsContext);

// Available to any child component that calls useAttachments()
function ProvideAttachments({ children, postId, postType, enabled }) {
	const provider = useProvideAttachments({ postId, postType, enabled });
	return (
		<attachmentsContext.Provider value={provider}>
			{children}
		</attachmentsContext.Provider>
	);
}

export { ProvideAttachments, useAttachments };
export default ProvideAttachments;
