/**
 * External Dependencies
 */
import styled from 'styled-components';

const labelStyle = `
	font-family: var(--wp--preset--font-family--sans-serif);
	font-size: var(--wp--preset--font-size--small-label);
	font-weight: 700;
	text-transform: uppercase;
	line-height: 15px;
	margin-bottom: 15px;
	letter-spacing: 0.05em;
	clear: both;
	color: black;
`;

const Label = styled.div`
	${labelStyle}
`;

const LabelButton = styled.button`
	background: none;
	border: none;
	padding: 0;
	margin: 0 !important;
	cursor: pointer;
	${labelStyle}
`;

export { Label, LabelButton };
