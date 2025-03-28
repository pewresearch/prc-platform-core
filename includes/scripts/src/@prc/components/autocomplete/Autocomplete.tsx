import PropTypes from 'prop-types';
import { useAutocomplete } from '@mui/base/useAutocomplete';
import styled from '@emotion/styled';
import useForkRef from '@mui/utils/useForkRef';
import { forwardRef } from '@wordpress/element';

import { AutocompleteProps, BlockStyleProps } from './types';
import StyledOption from './styled-components/StyledOption';
import StyledListbox from './styled-components/StyledListbox';
import InputWrapper from './styled-components/InputWrapper';

const Root = styled.div<BlockStyleProps>`
	position: relative;
`;

const Label = styled('label')`
	padding: 0 0 4px;
	line-height: 1.5;
	display: block;
`;

function Tag(props: any) {
	const { label, onDelete, ...other } = props;
	return (
		<div {...other}>
			<span>{label}</span>
			<span className="close-button" onClick={onDelete}>
				x
			</span>
		</div>
	);
}

Tag.propTypes = {
	label: PropTypes.string.isRequired,
	onDelete: PropTypes.func.isRequired,
};

const StyledTag = styled(Tag)(
	() => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: #40a9ff;
    background-color: #e6f7ff;
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
	font-family: 'franklin-gothic-urw', sans-serif;
  }

  & .close-button {
	font-size: 12px;
	cursor: pointer;
	padding: 4px;
  }
  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`
);

const CustomAutocomplete = forwardRef(function CustomAutocomplete(
	props: AutocompleteProps,
	ref
) {
	// https://mui.com/base-ui/react-autocomplete/hooks-api/#use-autocomplete-parameters
	const {
		getRootProps,
		getInputLabelProps,
		getInputProps,
		getTagProps,
		getListboxProps,
		getOptionProps,
		groupedOptions,
		value,
		focused,
		popupOpen,
		anchorEl,
		setAnchorEl,
	} = useAutocomplete(props);
	const { getOptionLabel, label, placeholder, blockStyles } = props;
	const rootRef = useForkRef(ref, setAnchorEl);
	console.log({ blockStyles });
	return (
		<Root styles={blockStyles}>
			<div {...getRootProps()} ref={rootRef}>
				{label && <Label {...getInputLabelProps()}>{label}</Label>}
				<InputWrapper
					ref={setAnchorEl}
					styles={blockStyles}
					className={focused ? 'focused' : ''}
				>
					{value && value.length > 0
						? value.map((option: any, index: number) => (
								<StyledTag
									label={getOptionLabel(option)}
									{...getTagProps({ index })}
								/>
						  ))
						: ''}
					<input
						{...getInputProps()}
						placeholder={
							value && value.length > 0 ? '' : placeholder
						}
					/>
				</InputWrapper>
			</div>
			{groupedOptions.length > 0 ? (
				<StyledListbox {...getListboxProps()}>
					{groupedOptions.map((option, index) => (
						<StyledOption {...getOptionProps({ option, index })}>
							<span>{getOptionLabel(option)}</span>
						</StyledOption>
					))}
				</StyledListbox>
			) : null}
			{/* </Popper>
			)} */}
		</Root>
	);
});

export default function Autocomplete(props: any) {
	return <CustomAutocomplete {...props} />;
}
