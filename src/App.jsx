import React, { useState } from 'react';
import DistributionChart from './ParetoChart';

function App() {
  const [distributionType, setDistributionType] = useState("pareto");
  const [alpha, setAlpha] = useState(3);
  const [scale, setScale] = useState(1);
  const [size, setSize] = useState(1000);
  const [x0, setX0] = useState(0);
  const [gamma, setGamma] = useState(1);

  return (
    <div className="App">
      <h1>Distribution Visualizer</h1>

      <div>
        <label>Distribution Type: </label>
        <select value={distributionType} onChange={e => setDistributionType(e.target.value)}>
          <option value="pareto">Pareto</option>
          <option value="cauchy">Cauchy</option>
          {/* You can add more options here in the future */}
        </select>
      </div>

      {distributionType === "pareto" && (
        <>
          <div>
            <label>Alpha: </label>
            <input type="number" value={alpha} onChange={e => setAlpha(+e.target.value)} />
          </div>
          <div>
            <label>Scale: </label>
            <input type="number" value={scale} onChange={e => setScale(+e.target.value)} />
          </div>
          <div>
            <label>Size: </label>
            <input type="number" value={size} onChange={e => setSize(+e.target.value)} />
          </div>
        </>
      )}

      {distributionType === "cauchy" && (
        <>
          <div>
            <label>x0 (Location): </label>
            <input type="number" value={x0} onChange={e => setX0(+e.target.value)} />
          </div>
          <div>
            <label>Gamma (Scale): </label>
            <input type="number" value={gamma} onChange={e => setGamma(+e.target.value)} />
          </div>
        </>
      )}

      <DistributionChart
        distributionType={distributionType}
        alpha={alpha}
        scale={scale}
        size={size}
        x0={x0}
        gamma={gamma}
      />
    </div>
  );
}

export default App;