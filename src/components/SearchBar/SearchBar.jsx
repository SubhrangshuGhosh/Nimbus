import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiNavigation } from 'react-icons/fi';
import './SearchBar.css';

function SearchBar({ onLocationSelect, placeholder = 'Search for a city…' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const resultsRef = useRef([]);

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
    }
  };

  // Debounced geocoding fetch
  useEffect(() => {
    if (query.trim().length < 2) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        // 🔑 Filter for India using countryCode=IN
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query.trim()
        )}&count=10&language=en&countryCode=IN&format=json`;
        
        const response = await fetch(url);
        const data = await response.json();
        setResults(data.results || []);
        setIsOpen(true);
        setHighlightedIndex(-1);
      } catch (err) {
        console.error('Geocoding error:', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (place) => {
    const location = {
      name: place.name,
      country: place.country,
      admin1: place.admin1,
      lat: place.latitude,
      lon: place.longitude,
      timezone: place.timezone,
    };
    setQuery(`${place.name}${place.country ? ', ' + place.country : ''}`);
    setIsOpen(false);
    setResults([]);
    onLocationSelect?.(location);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
          const res = await fetch(url);
          const data = await res.json();
          const name =
            data.city || data.locality || data.principalSubdivision || 'Unknown location';

          const location = {
            name,
            country: data.countryName || '',
            admin1: data.principalSubdivision || '',
            lat: latitude,
            lon: longitude,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          };

          setQuery(`${location.name}${location.country ? ', ' + location.country : ''}`);
          setIsOpen(false);
          setResults([]);
          onLocationSelect?.(location);
        } catch (err) {
          console.error('Reverse geocode failed:', err);
          onLocationSelect?.({ name: 'My Location', lat: latitude, lon: longitude });
          setQuery('My Location');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setIsLocating(false);
        if (err.code === 1) alert('Location permission denied.');
        else alert('Could not get your location.');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  const fetchAndSelectFirst = async (searchTerm) => {
    setIsLoading(true);
    try {
      // 🔑 Also filter by countryCode for the immediate Enter key action
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        searchTerm
      )}&count=10&language=en&countryCode=IN&format=json`;
      
      const response = await fetch(url);
      const data = await response.json();
      const places = data.results || [];

      if (places.length > 0) {
        handleSelect(places[0]);
      } else {
        setResults([]);
        setIsOpen(true);
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const currentResults = resultsRef.current;

      if (isOpen && highlightedIndex >= 0 && currentResults[highlightedIndex]) {
        handleSelect(currentResults[highlightedIndex]);
        return;
      }
      if (isOpen && currentResults.length > 0) {
        handleSelect(currentResults[0]);
        return;
      }
      if (query.trim().length >= 2 && !isLoading) {
        fetchAndSelectFirst(query.trim());
      }
      return;
    }

    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    }
  };

  return (
    <div id="searchbar-root" className="searchbar-root" ref={wrapperRef}>
      <div id="searchbar-input-wrapper" className="searchbar-input-wrapper">
        <FiSearch id="searchbar-icon-search" className="searchbar-icon" size={18} />
        <input
          id="searchbar-input"
          ref={inputRef}
          className="searchbar-input"
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
        />
        {query && (
          <button
            id="searchbar-clear-button"
            className="searchbar-clear-button"
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            <FiX size={16} />
          </button>
        )}
        <button
          id="searchbar-location-button"
          className={`searchbar-location-button ${
            isLocating ? 'searchbar-location-button-loading' : ''
          }`}
          onClick={handleUseCurrentLocation}
          aria-label="Use current location"
          title="Use my current location"
          type="button"
          disabled={isLocating}
        >
          <FiNavigation size={16} />
        </button>
      </div>

      {isOpen && (
        <ul id="searchbar-results" className="searchbar-results" role="listbox">
          {isLoading && (
            <li id="searchbar-loading" className="searchbar-loading">
              Searching…
            </li>
          )}
          {!isLoading && results.length === 0 && query.length >= 2 && (
            <li id="searchbar-empty" className="searchbar-empty">
              No results found
            </li>
          )}
          {!isLoading &&
            results.map((place, index) => (
              <li
                id={`searchbar-result-${index}`}
                key={place.id || `${place.latitude}-${place.longitude}`}
                className={`searchbar-result ${
                  index === highlightedIndex ? 'searchbar-result-active' : ''
                }`}
                onClick={() => handleSelect(place)}
                onMouseEnter={() => setHighlightedIndex(index)}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                <span
                  id={`searchbar-result-name-${index}`}
                  className="searchbar-result-name"
                >
                  {place.name}
                </span>
                <span
                  id={`searchbar-result-meta-${index}`}
                  className="searchbar-result-meta"
                >
                  {[place.admin1, place.country].filter(Boolean).join(', ')}
                </span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;