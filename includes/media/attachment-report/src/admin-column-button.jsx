/**
 * External Dependencies
 */
import styled from '@emotion/styled';
import classNames from 'classnames';

/**
 * WordPress Dependencies
 */
import { Fragment, useMemo, useState } from '@wordpress/element';
import { Spinner } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { useAttachments } from './context';
import AttachmentsModal from './modal';

const Button = styled.button`
	cursor: pointer !important;
	width: 100%;
	&.disabled {
		opacity: 0.5;
	}
`;

export default function AdminColumnButton({ initialized, handleHover }) {
	const [active, setActive] = useState(false);
	const toggleActive = () => setActive(!active);
	const { attachments, loading } = useAttachments();

	const disabledButton = useMemo(() => {
		return initialized && (loading || attachments.length === 0);
	}, [initialized, loading, attachments]);

	const buttonText = useMemo(() => {
		if (loading) {
			return (
				<Fragment>
					Loading... <Spinner />
				</Fragment>
			);
		}
		if (initialized && attachments.length === 0) {
			return 'No Attachments';
		}
		return 'View Attachments Report';
	}, [initialized, loading]);

	return (
		<Fragment>
			<Button
				className={classNames('button button-small button-secondary', {
					disabled: disabledButton,
				})}
				alt="View this post's attachments report"
				type="button"
				onMouseEnter={handleHover}
				onClick={() => {
					toggleActive();
				}}
			>
				{buttonText}
			</Button>
			{active && <AttachmentsModal onClose={() => setActive(false)} />}
		</Fragment>
	);
}
