/**
 * External Dependencies
 */
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { Fragment, useMemo, useState } from '@wordpress/element';
import { Modal as WPComModal, SearchControl } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { useAttachments } from './context';
import ImageGrid from './image-grid';

const Modal = styled(WPComModal)`
	* {
		font-family: 'Open Sans', sans-serif;
	}
`;

const ModalInner = styled.div`
	width: 80vw;
	min-height: 80vh;
	max-height: 80vh;
`;

export default function AttachmentsModal({ onClose }) {
	const { attachments, postTitle, loading } = useAttachments();
	const [searchTerm, setSearchTerm] = useState('');

	const handleSearch = (value) => {
		setSearchTerm(value);
	};

	const filteredData = useMemo(() => {
		return attachments.filter((image) => {
			const searchRegex = new RegExp(searchTerm, 'i');
			// check if image has mimetype and its a string...
			if (!image?.mimeType || 'string' !== typeof image?.mimeType) {
				return false;
			}
			return (
				image?.mimeType.startsWith('image/') &&
				(searchRegex.test(image.title) ||
					searchRegex.test(image.alt) ||
					searchRegex.test(image.caption))
			);
		});
	}, [attachments, searchTerm]);

	const modalTitle = useMemo(() => {
		if (postTitle) {
			return `Attachments Report: "${postTitle}"`;
		}
		return 'Attachments Report';
	}, [postTitle]);

	return (
		<Modal title={modalTitle} onRequestClose={onClose}>
			<ModalInner>
				{loading && <p>Loading...</p>}
				{!loading && (
					<Fragment>
						<SearchControl
							label="Filter by title, alt, or caption"
							placeholder="Filter attachments"
							value={searchTerm}
							onChange={handleSearch}
						/>
						{filteredData.length > 0 && (
							<ImageGrid data={filteredData} />
						)}
						{filteredData.length === 0 && (
							<p>No attachments found.</p>
						)}
					</Fragment>
				)}
			</ModalInner>
		</Modal>
	);
}
