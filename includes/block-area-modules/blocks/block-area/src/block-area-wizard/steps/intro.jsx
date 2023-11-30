/**
 * WordPress Dependencies
 */
import { Fragment, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button, Spinner } from '@wordpress/components';

import Step from './_step';

export default function Intro({
	isResolving,
	blockModules = [],
	setNextStep,
}) {
	return(
		<Step>
			<p>You can configure a block area to dynamically query the latest module. You can also restrict it by category. Alternatively, you can choose an existing block module or create a new one.</p>
			{ isResolving && <Spinner /> }
			{ ! isResolving && (
				<Button variant="primary" onClick={ () => setNextStep('query-a') }>
					{ __( 'Configure Area' ) }
				</Button>
			) }

			{ ! isResolving &&
				!! ( blockModules.length ) && (
					<Button variant="secondary" onClick={ () => setNextStep('select-a') }>
						{ __( 'Choose Module' ) }
					</Button>
				) }

			{ ! isResolving && (
				<Button variant="secondary" onClick={ () => setNextStep('create-a') }>
					{ __( 'Start Blank Module' ) }
				</Button>
			) }
		</Step>
	);
}
