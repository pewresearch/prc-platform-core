/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useMemo, useEffect } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import {addQueryArgs} from "@wordpress/url";

export default function MailchimpSegmentList({
	interests = [],
	onAdd = (item) => {console.log('onAdd', item)},
	onRemove = (item) => {console.log('onRemove', item)},
	onUpdate = (selected) => {console.log('onUpdate', selected)},
}) {
	const [selected, setSelected] = useState(interests);

	const updateSelection = (item) => {
		const tmp = selected;
		if (tmp.includes(item.value)) {
			const index = tmp.indexOf(item.value);
			if (-1 !== index) {
				tmp.splice(index, 1);
				onRemove(item);
			}
		} else {
			tmp.push(item.value);
			onAdd(item);
		}
		console.log("updateSelection", item, selected, tmp);
		setSelected([...tmp]);
	};

	useEffect(()=>{
		onUpdate(selected);
	}, [selected]);

	const [records, setRecords] = useState([]);

	useEffect(() => {
		apiFetch({
			path: addQueryArgs('/prc-api/v3/mailchimp/get-segments', {
				api_key: 'mailchimp-select',
			}),
		}).then((response) => {
			setRecords(response);
		});
	}, []);

	const memoizedOptions = useMemo(() => {
		if (!records) {
			return [];
		}
		return Object.keys(records).map(key => ({
			label: records[key].name,
			value: records[key].interest_id,
		}));
	}, [records]);

	return (
		<div>
			{memoizedOptions.map((item) => (
				<ToggleControl
					label={item.label}
					checked={selected.includes(item.value)}
					onChange={() => updateSelection(item)}
				/>
			))}
		</div>
	);
}
