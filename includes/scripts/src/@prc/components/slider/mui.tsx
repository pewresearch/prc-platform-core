import styled from '@emotion/styled';
// import Select from '@mui/base/Select';
import { Slider, sliderClasses } from '@mui/base/Slider';
// import Switch from '@mui/base/Switch';
export default function MUISlider() {
	return (
		<div style={{ width: 300 }}>
			<StyledSlider
				aria-label="Temperature"
				defaultValue={37}
				getAriaValueText={valuetext}
				marks={marks}
				step={10}
			/>
		</div>
	);
}

const marks = [
	{
		value: 0,
		label: '0°C',
	},
	{
		value: 20,
		label: '20°C',
	},
	{
		value: 37,
		label: '37°C',
	},
	{
		value: 100,
		label: '100°C',
	},
];

function valuetext(value: number) {
	return `${value}°C`;
}

const blue = {
	100: '#DAECFF',
	200: '#99CCF3',
	400: '#3399FF',
	300: '#66B2FF',
	500: '#007FFF',
	600: '#0072E5',
	900: '#003A75',
};

const grey = {
	50: '#f6f8fa',
	100: '#eaeef2',
	200: '#d0d7de',
	300: '#afb8c1',
	400: '#8c959f',
	500: '#6e7781',
	600: '#57606a',
	700: '#424a53',
	800: '#32383f',
	900: '#24292f',
};

const StyledSlider = styled(Slider)(
	() => `
  color: ${'light' === 'light' ? 'black' : 'gray'};
  height: 6px;
  width: 100%;
  padding: 16px 0;
  display: inline-block;
  position: relative;
  cursor: pointer;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    opacity: 1;
  }

  &.${sliderClasses.disabled} {
    pointer-events: none;
    cursor: default;
    color: ${'light' === 'light' ? grey[300] : grey[600]};
    opacity: 0.5;
  }

  & .${sliderClasses.rail} {
    display: block;
    position: absolute;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background-color: ${'light' === 'light' ? 'black' : 'black'};
  }

  & .${sliderClasses.track} {
    display: block;
    position: absolute;
    height: 4px;
    border-radius: 2px;
    background-color: currentColor;
  }

  & .${sliderClasses.thumb} {
    position: absolute;
    width: 16px;
    height: 16px;
    margin-left: -6px;
    margin-top: -6px;
    box-sizing: border-box;
    border-radius: 50%;
    outline: 0;
    border: 3px solid currentColor;
    background-color: #fff;
  }

  & .${sliderClasses.mark} {
    position: absolute;
    width: 2px;
    height: 8px;
    border-radius: 0;
    background-color: ${'light' === 'light' ? 'black' : 'black'};
    top: 43%;
    transform: translateX(-50%);
  }

  & .${sliderClasses.markActive} {
    background-color: ${'light' === 'light' ? 'black' : 'gray'};
  }

  & .${sliderClasses.markLabel} {
    font-size: 12px;
    position: absolute;
    top: 20px;
    transform: translateX(-50%);
    margin-top: 8px;
  }
`
);
