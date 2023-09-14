import { registerListStore } from '@prc/components';

import resolvers from './resolvers';
import selectors from './selectors';

registerListStore('prc/related-posts', resolvers, selectors);
