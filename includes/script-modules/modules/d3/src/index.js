/* eslint-disable import/prefer-default-export */
import { format } from 'd3-format';
import {
	select,
	selectAll,
	geoPath,
	create,
	zoom,
	geoAlbersUsa,
	zoomIdentity,
} from 'd3';

const _format = format;
const _select = select;
const _selectAll = selectAll;
const _geoPath = geoPath;
const _create = create;
const _zoom = zoom;
const _geoAlbersUsa = geoAlbersUsa;
const _zoomIdentity = zoomIdentity;

export {
	_format as format,
	_select as select,
	_selectAll as selectAll,
	_geoPath as geoPath,
	_create as create,
	_zoom as zoom,
	_geoAlbersUsa as geoAlbersUsa,
	_zoomIdentity as zoomIdentity,
};
