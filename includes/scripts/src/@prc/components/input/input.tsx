import { useInput } from '@mui/base/useInput';
import styled from '@emotion/styled';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { forwardRef } from '@wordpress/element';

const PRCInput = forwardRef(function CustomInput(props, ref) {
	const { getRootProps, getInputProps } = useInput(props);

	const inputProps = getInputProps();

	// Make sure that both the forwarded ref and the ref returned from the getInputProps are applied on the input element
	inputProps.ref = useForkRef(inputProps.ref, ref);

	return (
		<div {...getRootProps()}>
			<StyledInputElement {...props} {...inputProps} />
		</div>
	);
});

export default PRCInput;

const blue = {
	100: '#DAECFF',
	200: '#80BFFF',
	400: '#3399FF',
	500: '#007FFF',
	600: '#0072E5',
	700: '#0059B2',
};

const grey = {
	50: '#F3F6F9',
	100: '#E5EAF2',
	200: '#DAE2ED',
	300: '#C7D0DD',
	400: '#B0B8C4',
	500: '#9DA8B7',
	600: '#6B7A90',
	700: '#434D5B',
	800: '#303740',
	900: '#1C2025',
};

const StyledInputElement = styled('input')(
	() => `
  width: 320px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${grey[900]};
  background: ${'#fff'};
  border: 1px solid ${grey[200]};
  box-shadow: 0px 2px 4px ${'rgba(0,0,0, 0.05)'};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);
