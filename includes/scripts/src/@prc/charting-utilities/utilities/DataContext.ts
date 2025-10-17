import { createContext } from 'react';
import { BaseConfig } from '../types/configTypes';
import baseConfig from './baseConfig';
import { randomDataPoints } from './randomData';

type Data = {
	data: any;
	config: BaseConfig;
	tableData?: {
		header: string[];
		rows: string[][];
		footer?: string[];
	};
	wpEditorFunctions?: any;
};
export const DataContext = createContext<Data>({
	data: [randomDataPoints(2, 1, 10)],
	config: baseConfig,
	tableData: undefined,
});
export const DataConsumer = DataContext.Consumer;
export const DataProvider = DataContext.Provider;
