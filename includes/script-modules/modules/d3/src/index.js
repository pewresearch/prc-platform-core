/* eslint-disable import/prefer-default-export */
import { format } from 'd3-format';

// For more info on discontinuous scale: https://www.npmjs.com/package/@d3fc/d3fc-discontinuous-scale#discontinuityRange
import {
	scaleDiscontinuous,
	discontinuityRange,
} from '@d3fc/d3fc-discontinuous-scale';

import {
	select,
	selectAll,
	geoPath,
	create,
	zoom,
	geoAlbersUsa,
	zoomIdentity,
	axisBottom,
	axisLeft,
	scaleLinear,
	scaleOrdinal,
	scaleBand,
	sort,
	max,
	easeCubicInOut,
	arc,
	pie,
} from 'd3';

const _format = format;
const _select = select;
const _selectAll = selectAll;
const _geoPath = geoPath;
const _create = create;
const _zoom = zoom;
const _geoAlbersUsa = geoAlbersUsa;
const _zoomIdentity = zoomIdentity;
const _axisBottom = axisBottom;
const _axisLeft = axisLeft;
const _scaleLinear = scaleLinear;
const _scaleBand = scaleBand;
const _scaleOrdinal = scaleOrdinal;
const _scaleDiscontinuous = scaleDiscontinuous;
const _discontinuityRange = discontinuityRange;
const _easeCubicInOut = easeCubicInOut;
const _sort = sort;
const _max = max;
const _arc = arc;
const _pie = pie;

export {
	_format as format,
	_select as select,
	_selectAll as selectAll,
	_geoPath as geoPath,
	_create as create,
	_zoom as zoom,
	_geoAlbersUsa as geoAlbersUsa,
	_zoomIdentity as zoomIdentity,
	_axisBottom as axisBottom,
	_axisLeft as axisLeft,
	_scaleLinear as scaleLinear,
	_scaleBand as scaleBand,
	_scaleOrdinal as scaleOrdinal,
	_scaleDiscontinuous as scaleDiscontinuous,
	_discontinuityRange as discontinuityRange,
	_easeCubicInOut as easeCubicInOut,
	_sort as sort,
	_max as max,
	_arc as arc,
	_pie as pie,
};
