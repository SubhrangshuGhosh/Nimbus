import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloud,
  WiCloudy,
  WiFog,
  WiSprinkle,
  WiRain,
  WiShowers,
  WiSnow,
  WiSnowflakeCold,
  WiThunderstorm,
  WiSleet,
} from 'react-icons/wi';
import './CurrentWeather.css';

const ICON_MAP = {
  clear: WiDaySunny,
  'mostly-clear': WiDayCloudy,
  'partly-cloudy': WiDayCloudy,
  'mostly-cloudy': WiCloud,
  cloudy: WiCloudy,
  fog: WiFog,
  'light-fog': WiFog,
  drizzle: WiSprinkle,
  rain: WiRain,
  'light-rain': WiShowers,
  'heavy-rain': WiRain,
  snow: WiSnow,
  flurries: WiSnowflakeCold,
  'light-snow': WiSnow,
  'heavy-snow': WiSnow,
  thunderstorm: WiThunderstorm,
  'freezing-drizzle': WiSleet,
  'freezing-rain': WiSleet,
  'light-freezing-rain': WiSleet,
  'heavy-freezing-rain': WiSleet,
  'ice-pellets': WiSleet,
};

function CurrentWeather({ temperature, condition }) {
  const Icon = ICON_MAP[condition?.icon] || WiDaySunny;

  return (
    <div id="currentweather-root" className="currentweather-root">
      <div
        id="currentweather-icon-wrapper"
        className="currentweather-icon-wrapper"
      >
        <Icon id="currentweather-icon" size={96} />
      </div>

      <div
        id="currentweather-temp-wrapper"
        className="currentweather-temp-wrapper"
      >
        <span
          id="currentweather-temperature"
          className="currentweather-temperature"
        >
          {Math.round(temperature)}
        </span>
        <span id="currentweather-unit" className="currentweather-unit">
          °C
        </span>
      </div>

      <p id="currentweather-condition" className="currentweather-condition">
        {condition?.label}
      </p>
    </div>
  );
}

export default CurrentWeather;