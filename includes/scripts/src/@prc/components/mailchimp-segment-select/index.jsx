/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl, Spinner } from '@wordpress/components';
import { useEffect, useState, useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

export default function MailchimpSegmentSelect({
	label = 'Select a MailChimp Segment',
	className,
	value,
	onChange,
	apiKey = 'mailchimp-form',
}) {
	const [currentValue, setCurrentValue] = useState(value);
	const [records, setRecords] = useState([]);

	useEffect(() => {
		apiFetch({
			path: addQueryArgs('/prc-api/v3/mailchimp/get-segments', {
				api_key: apiKey,
			}),
		}).then((response) => {
			setRecords(response);
		});
	}, [apiKey]);

	useEffect(() => {
		if (currentValue) {
			onChange(currentValue);
		}
	}, [currentValue]);

	const memoizedOptions = useMemo(() => {
		if (!records) {
			return [];
		}
		return [
			{ label: 'Loading MailChimp segments...', value: '' },
			...Object.keys(records).map(key => ({
				label: records[key].name,
				value: records[key].interest_id,
			}))
		];
	}, [records]);

	const hasOptions = memoizedOptions ? 0 < memoizedOptions.length : false;

	return (
		<div className={className}>
			{!hasOptions && <Spinner />}
			{hasOptions && (
				<SelectControl
					label={label}
					value={currentValue}
					options={memoizedOptions}
					onChange={(newValue) => {
						setCurrentValue(newValue);
					}}
					__nextHasNoMarginBottom
				/>
			)}
		</div>
	);
}
