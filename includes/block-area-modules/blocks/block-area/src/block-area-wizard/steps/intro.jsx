/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Spinner } from '@wordpress/components';

import Step from './_step';

export default function Intro({ isResolving, blockModules = [], setNextStep }) {
	return (
		<Step>
			<p>
				You can configure a block area to dynamically query the latest
				module by the block area and/or an additional taxonomy.
				Alternatively, you can statically insert an existing block
				module or create a new blank one.
			</p>
			{isResolving && <Spinner />}
			{!isResolving && (
				<Button
					variant="primary"
					onClick={() => setNextStep('query-a')}
				>
					{__('Configure Block Area')}
				</Button>
			)}

			{!isResolving && !!blockModules.length && (
				<Button
					variant="secondary"
					onClick={() => setNextStep('select-a')}
				>
					{__('Choose Existing Module')}
				</Button>
			)}

			{!isResolving && (
				<Button
					variant="secondary"
					onClick={() => setNextStep('create-a')}
				>
					{__('Start New Module')}
				</Button>
			)}
		</Step>
	);
}
