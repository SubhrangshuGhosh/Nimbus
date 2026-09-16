import './Logo.css';

function Logo({ size = 28 }) {
  return (
    <div id="logo-root" className="logo-root">
      <svg
        id="logo-mark"
        className="logo-mark"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Nimbus logo"
      >
        <g id="logo-cloud-group" className="logo-cloud-group">
          <circle id="logo-cloud-left" className="logo-cloud" cx="16" cy="20" r="8" />
          <circle id="logo-cloud-middle" className="logo-cloud" cx="24" cy="16" r="10" />
          <circle id="logo-cloud-right" className="logo-cloud" cx="32" cy="20" r="8" />
          <rect
            id="logo-cloud-base"
            className="logo-cloud"
            x="8"
            y="20"
            width="32"
            height="10"
            rx="5"
          />
        </g>
        <circle id="logo-sun" className="logo-sun" cx="24" cy="38" r="3.5" />
      </svg>

      <span id="logo-text" className="logo-text">
        Nimbus
      </span>
    </div>
  );
}

export default Logo;