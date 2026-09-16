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
import { getWeatherInfo } from '../../utils/weatherCodes';
import './HourlyStrip.css';

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
  'freezing-drizzle': WiSleet,
  'freezing-rain': WiSleet,
  'light-freezing-rain': WiSleet,
  'heavy-freezing-rain': WiSleet,
  'ice-pellets': WiSleet,
  thunderstorm: WiThunderstorm,
};

function HourlyStrip({ hourly }) {
  if (!hourly || hourly.length === 0) return null;

  const isHourNight = (date) => {
    const h = date.getHours();
    return h < 6 || h >= 19;
  };

  const getIcon = (info, date) => {
    const night = isHourNight(date);
    if (night) {
      if (info.icon === 'clear') return WiNightClear;
      if (info.icon === 'mostly-clear') return WiNightAltCloudy;
      if (info.icon === 'partly-cloudy') return WiNightAltCloudy;
    }
    return ICON_MAP[info.icon] || (night ? WiNightClear : WiDaySunny);
  };

  const formatHour = (date, index) => {
    if (index === 0) return 'Now';
    let h = date.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h} ${ampm}`;
  };

  const upcoming = hourly.slice(0, 6);

  return (
    <div id="hourlystrip-root" className="hourlystrip-root">
      <div id="hourlystrip-scroll" className="hourlystrip-scroll">
        {upcoming.map((entry, index) => {
          const info = getWeatherInfo(entry.values.weatherCode);
          const date = new Date(entry.time);
          const Icon = getIcon(info, date);

          return (
            <div
              id={`hourlystrip-item-${index}`}
              key={entry.time}
              className={`hourlystrip-item ${
                index === 0 ? 'hourlystrip-item-now' : ''
              }`}
            >
              <span id={`hourlystrip-item-${index}-time`} className="hourlystrip-time">
                {formatHour(date, index)}
              </span>
              <span
                id={`hourlystrip-item-${index}-icon-wrapper`}
                className="hourlystrip-icon-wrapper"
              >
                <Icon size={34} />
              </span>
              <span id={`hourlystrip-item-${index}-temp`} className="hourlystrip-temp">
                {Math.round(entry.values.temperature)}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HourlyStrip;