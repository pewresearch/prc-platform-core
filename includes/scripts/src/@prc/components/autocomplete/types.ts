type AutocompleteProps = {
	id?: string;
	options: Array<{
		label: string;
		value: string | number;
		[key: string]: any;
	}>;
	label?: string | null;
	placeholder?: string;
	value?: string;
	multiple?: boolean;
	disabled?: boolean;
	isLoading?: boolean;
	getOptionLabel: (option: any) => string;
	onChange?: (
		event: React.SyntheticEvent,
		value: any,
		reason: any,
		details?: any
	) => void;
	onInputChange?: (
		event: React.SyntheticEvent,
		value: any,
		reason: any
	) => void;
	onOpen?: (event: React.SyntheticEvent) => void;
	onClose?: (event: React.SyntheticEvent) => void;
	blockStyles?: any;
};

type BlockStyleProps = {
	styles?: {
		border?: {
			radius?: string;
			width?: string;
		};
		spacing?: {
			padding?: string;
			margin?: string;
		};
		typography?: {
			fontWeight?: string;
			lineHeight?: string;
		};
	};
	borderColor?: string;
	fontSize?: string;
	fontFamily?: string;
};

export type { AutocompleteProps, BlockStyleProps };
