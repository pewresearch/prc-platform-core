import styled from '@emotion/styled';

import { grey } from './colors';

const StyledListbox = styled('ul')(
	() => `
	font-size: inherit;
	font-family: inherit;
	box-sizing: border-box;
	min-height: calc(1.5em + 22px);
	width: 100%
	padding: 12px;
	border-radius: 12px;
	text-align: left;
	line-height: 1.5;
	background: ${'#fff'};
	border: 1px solid ${grey[200]};
	color: ${grey[900]};
	padding: 5px;
	margin: 5px 0 0 0;
	position: absolute;
	height: 200px;
	width: 100%;
	overflow-y: scroll;
	z-index: 1000;
	outline: 0px;
	list-style: none;
	box-shadow: 0px 2px 6px ${'rgba(0,0,0, 0.05)'};
	&.hidden {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.4s ease, visibility 0.4s step-end;
  }
  `
);

export default StyledListbox;
