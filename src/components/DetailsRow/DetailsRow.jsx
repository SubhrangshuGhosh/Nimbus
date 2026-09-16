import { FiThermometer, FiDroplet, FiWind, FiCloudRain } from 'react-icons/fi';
import './DetailsRow.css';

function DetailsRow({ feelsLike, humidity, windSpeed, rainChance }) {
  const details = [
    { id: 'detailsrow-feels', Icon: FiThermometer, label: 'Feels like', value: `${Math.round(feelsLike)}°` },
    { id: 'detailsrow-humidity', Icon: FiDroplet, label: 'Humidity', value: `${Math.round(humidity)}%` },
    { id: 'detailsrow-wind', Icon: FiWind, label: 'Wind', value: `${Math.round(windSpeed)} km/h` },
    { id: 'detailsrow-rain', Icon: FiCloudRain, label: 'Rain', value: `${Math.round(rainChance)}%` },
  ];

  return (
    <div id="detailsrow-root" className="detailsrow-root">
      {details.map(({ id, Icon, label, value }) => (
        <div id={id} key={id} className="detailsrow-item">
          <span id={`${id}-icon-wrapper`} className="detailsrow-icon-wrapper">
            <Icon size={16} />
          </span>
          <span id={`${id}-label`} className="detailsrow-label">{label}</span>
          <span id={`${id}-value`} className="detailsrow-value">{value}</span>
        </div>
      ))}
    </div>
  );
}

export default DetailsRow;