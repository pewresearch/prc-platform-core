type InputProps = {
	id?: string;
	label?: string | null;
	placeholder?: string;
	value?: string;
	disabled?: boolean;
	isLoading?: boolean;
	onChange?: (event: React.SyntheticEvent, value: any) => void;
	onInputChange?: (event: React.SyntheticEvent, value: any) => void;
	onFocus?: (event: React.SyntheticEvent) => void;
	onBlur?: (event: React.SyntheticEvent) => void;
};

export default InputProps;
