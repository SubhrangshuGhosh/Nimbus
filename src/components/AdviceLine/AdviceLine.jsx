import './AdviceLine.css';

function AdviceLine({ advice }) {
  return (
    <p id="adviceline-root" className="adviceline-root">
      {advice}
    </p>
  );
}

export default AdviceLine;