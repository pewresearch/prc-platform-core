import { useRef, useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

const useAfterPublish = () => {
	const [isPostPublished, setIsPostPublished] = useState(false);
	const [isPostPublishing, setIsPublishing] = useState(false);
	const isPostPublishInProgress = useRef(false);
	const { isPublishing, isAutosavingPost } = useSelect((select) => {
		return {
			isPublishing: select('core/editor').isPublishingPost(),
			isAutosavingPost: select('core/editor').isAutosavingPost(),
		};
	}, []);

	useEffect(() => {
		if (
			(isPublishing || isAutosavingPost) &&
			!isPostPublishInProgress.current
		) {
			console.log('start publish', isPostPublishInProgress.current);
			setIsPostPublished(false);
			setIsPublishing(true);
			isPostPublishInProgress.current = true;
		}
		console.log(
			'check publish',
			isPublishing,
			isPostPublishInProgress.current
		);
		if (
			!(isPublishing || isAutosavingPost) &&
			isPostPublishInProgress.current
		) {
			console.log('end publish', isPostPublishInProgress.current);
			setIsPostPublished(true);
			setIsPublishing(false);
			isPostPublishInProgress.current = false;
		}
	}, [isPublishing, isAutosavingPost]);

	return {
		isPublished: isPostPublished,
		isPublishing: isPostPublishing,
	};
};

export default useAfterPublish;
