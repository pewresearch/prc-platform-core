import { useRef, useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

const useAfterPreview = () => {
	const [isPostPreviewed, setIsPostPreviewed] = useState(false);
	const [isPostPreviewing, setIsPreviewing] = useState(false);
	const isPostPreviewInProgress = useRef(false);
	const { isPreviewing, isAutosavingPost } = useSelect((select) => {
		return {
			isPreviewing: select('core/editor').isPreviewingPost(),
			isAutosavingPost: select('core/editor').isAutosavingPost(),
		};
	}, []);

	useEffect(() => {
		if (
			(isPreviewing || isAutosavingPost) &&
			!isPostPreviewInProgress.current
		) {
			console.log('start preview', isPostPreviewInProgress.current);
			// Code to run when post is starting to build preview...
			setIsPostPreviewed(false);
			setIsPreviewing(true);
			isPostPreviewInProgress.current = true;
		}
		console.log(
			'check preview',
			isPreviewing,
			isPostPreviewInProgress.current
		);
		if (
			!(isPreviewing || isAutosavingPost) &&
			isPostPreviewInProgress.current
		) {
			console.log('end preview', isPostPreviewInProgress.current);
			// Code to run after post is done previewing...
			setIsPostPreviewed(true);
			setIsPreviewing(false);
			isPostPreviewInProgress.current = false;
		}
	}, [isPreviewing, isAutosavingPost]);

	return {
		isPreviewed: isPostPreviewed,
		isPreviewing: isPostPreviewing,
	};
};

export default useAfterPreview;
