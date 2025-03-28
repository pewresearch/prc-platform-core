/**
 * External Dependencies
 */
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelect, SelectProvider } from '@mui/base/useSelect';
import { useOption } from '@mui/base/useOption';

/**
 * WordPress Dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import StyledButton from './styled-components/StyledButton';
import StyledListbox from './styled-components/StyledListbox';
import StyledOption from './styled-components/StyledOption';
import { SelectProps } from './types';

const Root = styled('div')`
	position: relative;
`;

function renderSelectedValue(value: any, options: any[], multiple: boolean) {
	// for each value in options, if value === option.value, return option.label and join with ', '
	const selectedOptions = value
		? options.filter((option) => {
				return value.includes(option.value);
		  })
		: [];
	if (multiple && selectedOptions.length > 0)
		return selectedOptions.map((option) => option.label).join(', ');
	if (!multiple && selectedOptions.length > 0)
		return selectedOptions[0].label;
	return null;
}

function CustomOption(props: {
	children: any;
	value: string;
	disabled?: true | false | undefined;
}) {
	const { children, value, disabled = false } = props;
	// https://mui.com/base-ui/react-select/hooks-api/#use-select-parameters
	const { getRootProps, highlighted } = useOption({
		value,
		disabled,
		label: children,
	});
	return (
		<StyledOption
			{...getRootProps()}
			className={classNames({ highlighted })}
			// style={{ '--color': value }}
		>
			{children}
		</StyledOption>
	);
}

CustomOption.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	value: PropTypes.string.isRequired,
};

function CustomSelect(props: SelectProps) {
	const { options, placeholder, multiple, ref } = props;
	const listboxRef = useRef<HTMLUListElement | null>(null);
	const [listboxVisible, setListboxVisible] = useState(false);

	// https://mui.com/base-ui/react-select/hooks-api/#use-select-parameters
	const {
		getButtonProps,
		getListboxProps,
		getOptionMetadata,
		contextValue,
		value,
		disabled,
	} = useSelect({
		listboxRef,
		onOpenChange: setListboxVisible,
		open: listboxVisible,
		...props,
	});

	useEffect(() => {
		if (listboxVisible) {
			listboxRef.current?.focus();
		}
	}, [listboxVisible]);


	return (
		<Root ref={ref}>
			<StyledButton {...getButtonProps()}>
				{renderSelectedValue(value, options, multiple) || (
					<span className="placeholder">{placeholder ?? ' '}</span>
				)}
			</StyledButton>
			<StyledListbox
				{...getListboxProps()}
				aria-hidden={!listboxVisible}
				className={listboxVisible ? '' : 'hidden'}
			>
				<SelectProvider value={contextValue}>
					{options.map((option) => {
						return (
							<CustomOption
								key={option.value}
								value={option.value}
								disabled={option.disabled}
							>
								{option.label}
							</CustomOption>
						);
					})}
				</SelectProvider>
			</StyledListbox>
		</Root>
	);
}

CustomSelect.propTypes = {
	options: PropTypes.arrayOf(
		PropTypes.shape({
			disabled: PropTypes.bool,
			label: PropTypes.string.isRequired,
			value: PropTypes.string.isRequired,
		})
	).isRequired,
	placeholder: PropTypes.string,
};

export default function Select(props: SelectProps) {
	return <CustomSelect {...props} />;
}
