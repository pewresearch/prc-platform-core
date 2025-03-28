import styled from '@emotion/styled';
import { selectClasses } from '@mui/base';
import { BlockStyleProps } from '../types';
import { grey, blue } from './colors';

const StyledButton = styled.div<BlockStyleProps>`
	line-height: ${({ styles }) => styles?.typography?.lineHeight || '1.5'};
	font-weight: ${({ styles }) => styles?.typography?.fontWeight || '400'};
	font-size: inherit;
	font-family: inherit;
	box-sizing: border-box;
	width: 100%;
	padding: 8px 12px;
	text-align: left;
	background: ${'#fff'};
	border: none;
	color: var(--wp--preset--color--ui-text-color);
	transition-property: all;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-duration: 120ms;

	&:hover {
		background: ${grey[50]};
		border-color: ${grey[300]};
	}

	&.${selectClasses.focusVisible} {
		border-color: ${blue[400]};
		outline: 3px solid ${blue[200]};
	}

	&.${selectClasses.expanded} {
		&::after {
			content: '▴';
		}
	}

	&::after {
		content: '▾';
		float: right;
	}
`;

export default StyledButton;
