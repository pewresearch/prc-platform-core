import styled from '@emotion/styled';

import { grey, blue } from './_colors';

const StyledOption = styled('li')(
	() => `
	list-style: none;
	padding: 8px;
	border-radius: 8px;
	cursor: default;

	&:last-of-type {
	  border-bottom: none;
	}

	&:hover {
	  cursor: pointer;
	}

	&[aria-selected=true] {
	  background-color: ${blue[100]};
	  color: ${blue[900]};
	}

	&.highlighted,
	&:hover {
	  background-color: ${grey[100]};
	  color: ${grey[900]};
	}

	&.Mui-focusVisible {
	  box-shadow: 0 0 0 3px ${blue[200]};
	}

	&[aria-selected=true].Mui-focused,
	&[aria-selected=true].Mui-focusVisible {
	  background-color: ${blue[100]};
	  color: ${blue[900]};
	}
	`
);

export default StyledOption;
