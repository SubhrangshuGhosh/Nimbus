import SearchBar from '../SearchBar/SearchBar';
import CurrentWeather from '../CurrentWeather/CurrentWeather';
import DetailsRow from '../DetailsRow/DetailsRow';
import './CompareView.css';

function CompareView({
  weatherA,
  weatherB,
  conditionA,
  conditionB,
  loadingA,
  loadingB,
  errorA,
  errorB,
  onLocationASelect,
  onLocationBSelect,
}) {
  // Generate a comparison summary line
  const summary = (() => {
    if (!weatherA || !weatherB) return null;

    const tempA = weatherA.current.temperature;
    const tempB = weatherB.current.temperature;
    const diff = Math.abs(Math.round(tempA - tempB));

    if (diff === 0) {
      return 'Both cities have the same temperature right now.';
    }

    const warmer = tempA > tempB ? weatherA.location.name : weatherB.location.name;
    return `${diff}°C warmer in ${warmer}.`;
  })();

  const renderPanel = (weather, condition, advice, loading, error, side) => {
    if (loading) {
      return (
        <div id={`compareview-panel-${side}`} className="compareview-panel">
          <p className="compareview-panel-state">Loading…</p>
        </div>
      );
    }

    if (error) {
      return (
        <div id={`compareview-panel-${side}`} className="compareview-panel">
          <p className="compareview-panel-state compareview-panel-error">⚠️ {error}</p>
        </div>
      );
    }

    if (!weather) {
      return (
        <div id={`compareview-panel-${side}`} className="compareview-panel">
          <p className="compareview-panel-state">Pick a city above.</p>
        </div>
      );
    }

    return (
      <div id={`compareview-panel-${side}`} className="compareview-panel">
        <p id={`compareview-panel-${side}-name`} className="compareview-panel-name">
          {weather.location.name}
        </p>
        <CurrentWeather
          temperature={weather.current.temperature}
          condition={condition}
        />
        <DetailsRow
          feelsLike={weather.current.temperatureApparent}
          humidity={weather.current.humidity}
          windSpeed={weather.current.windSpeed}
          rainChance={weather.current.precipitationProbability}
        />
      </div>
    );
  };

  return (
    <div id="compareview-root" className="compareview-root">
      <div id="compareview-searches" className="compareview-searches">
        <div id="compareview-search-a" className="compareview-search">
          <SearchBar
            onLocationSelect={onLocationASelect}
            placeholder="First city…"
          />
        </div>
        <div id="compareview-search-b" className="compareview-search">
          <SearchBar
            onLocationSelect={onLocationBSelect}
            placeholder="Second city…"
          />
        </div>
      </div>

      <div id="compareview-panels" className="compareview-panels">
        {renderPanel(weatherA, conditionA, '', loadingA, errorA, 'a')}
        {renderPanel(weatherB, conditionB, '', loadingB, errorB, 'b')}
      </div>

      {summary && (
        <p id="compareview-summary" className="compareview-summary">
          {summary}
        </p>
      )}
    </div>
  );
}

export default CompareView;