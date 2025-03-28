// Typing to ensure correct usage of the Select Hooks API:
// https://mui.com/base-ui/react-select/hooks-api/

type SelectProps = {
	ref?: React.Ref<any>;
	id?: string;
	name?: string;
	options: Array<{
		label: string;
		value: string;
		[key: string]: any;
	}>;
	defaultOpen?: boolean;
	disabled?: boolean;
	required?: boolean;
	label?: string | null;
	placeholder?: string;
	value?: string;
	multiple: boolean;
	onChange?: (event: any, value: any) => void;
	onOpen?: (event: React.SyntheticEvent) => void;
	children?: React.ReactNode;
};

type OptionProps = {
	label: string;
	value: string | number;
	[key: string]: any;
};

export type { SelectProps, OptionProps };
