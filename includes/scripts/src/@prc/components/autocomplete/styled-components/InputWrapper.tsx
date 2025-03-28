import styled from '@emotion/styled';
import { BlockStyleProps } from '../types';

const InputWrapper = styled.div<BlockStyleProps>`
	border-radius: ${({ styles }) => styles?.border?.radius || '0'};
	border-width: ${({ styles }) => styles?.border?.width || '0'};
	width: 100%;
	border-color: #d9d9d9;
	background-color: var(--wp--preset--color--ui-white);
	color: var(--wp--preset--color--ui-text-color);
	padding: 1px;
	display: flex;
	flex-wrap: wrap;
	font-size: inherit;
	font-family: inherit;

	&:hover {
		border-color: #40a9ff;
	}

	&.focused {
		border-color: #40a9ff;
		box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
	}

	& input {
		line-height: ${({ styles }) => styles?.typography?.lineHeight || '1.5'};
		font-weight: ${({ styles }) => styles?.typography?.fontWeight || '400'};
		font-size: ${({ fontSize }) => fontSize || 'inherit'};
		font-family: ${({ fontFamily }) => fontFamily || 'inherit'};
		background-color: #fff;
		color: var(--wp--preset--color--ui-text-color);
		height: 30px;
		box-sizing: border-box;
		padding: 4px 6px;
		width: 0;
		min-width: 30px;
		flex-grow: 1;
		border: 0;
		margin: 0;
		outline: 0;
	}
`;

export default InputWrapper;
