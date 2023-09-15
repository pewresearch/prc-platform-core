import { select } from '@wordpress/data';

import { listStoreActions } from '@prc-app/shared';

// Initially resolve if there is saved data.
const resolvers = {
    *getItems() {
        const meta = select(
            'core/editor',
        ).getEditedPostAttribute('meta');

        const { reportMaterials } = meta;

        console.log('reportMaterials?', reportMaterials, meta);

        if (null === reportMaterials ) {
            return;
        }

        // Seed state with report material items.
        yield listStoreActions.seed(reportMaterials);
    },
};

export default resolvers;
