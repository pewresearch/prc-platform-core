import styled from '@emotion/styled';
import { selectClasses } from '@mui/base';

import { grey, blue } from './_colors';

const StyledButton = styled('button')(
	() => `
  font-size: inherit;
  font-family: inherit;
	width: 100%;
  box-sizing: border-box;
  padding: 8px 12px;
  text-align: left;
  line-height: 1.5;
  background: ${'#fff'};
	color: var(--wp--preset--color--ui-text-color);
	border-color: var(--border-color);
	border-radius: var(--wp--custom--border-radius);
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;



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
  `
);

export default StyledButton;
// TODO: Might want to readd these classes
// &:disabled {
// 	color: ${grey[500]};
// 	background-color: ${grey[100]};
// 	border-color: ${grey[200]};
// }
// &:hover {
// 	background: ${grey[50]};
// 	border-color: ${grey[300]};
// }
