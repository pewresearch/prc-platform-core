import { registerListStore } from '@prc/components';

import resolvers from './resolvers';
import selectors from './selectors';

export const STORE_NAME = 'prc-platform/features';
export const registerStore = () =>
	registerListStore('prc-platform/features', resolvers, selectors);
