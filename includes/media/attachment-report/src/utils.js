/**
 * External Dependencies
 */
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { TextControl, TextareaControl } from '@wordpress/components';

const UnstyledButton = styled.button`
	background: none;
	border: none;
	margin: 0;
	padding: 0;
	font: inherit;
	cursor: pointer;
	outline: inherit;
	text-align: left;
`;

const DefaultElem = styled.span`
	display: inline-block;
`;

const CopyText = ({ value, asInputField = false }) => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(value);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	};

	return (
		<UnstyledButton
			onClick={handleCopy}
			style={{ cursor: 'pointer' }}
			title="Click to copy"
		>
			<TextareaControl
				value={isCopied ? '✅ Copied!' : value}
				onChange={() => {}}
				readOnly
				style={{ cursor: 'pointer' }}
			/>
		</UnstyledButton>
	);
};

export { UnstyledButton, CopyText };
