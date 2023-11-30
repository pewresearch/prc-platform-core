/**
 * External Dependencies
 */
import styled from 'styled-components';

const MoreButtonDiv = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	font-family: var(--wp--preset--font-family--sans-serif);
`;

function MoreButton({ isOpen, onClick }) {
	return (
		<MoreButtonDiv
			type="button"
			onClick={() => {
				onClick(!isOpen);
			}}
		>
			{isOpen ? '- Less' : '+ More'}
		</MoreButtonDiv>
	);
}

export default MoreButton;
