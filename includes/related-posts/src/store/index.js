import { registerListStore } from '@prc-app/shared';

import resolvers from './resolvers';
import selectors from './selectors';

registerListStore('prc/related-posts', resolvers, selectors);
