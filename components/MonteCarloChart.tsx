"use client";

import React, { useState } from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine, 
  ResponsiveContainer,
  Cell
} from 'recharts';

// Helper: Box-Muller transform for normal distribution in JS
function randomNormal(mean: number, stdDev: number) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

// Helper: Uniform distribution
function randomUniform(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function MonteCarloChart() {
  const [data, setData] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [iterations, setIterations] = useState(2000);

  const runSimulation = () => {
    setIsSimulating(true);
    
    // Slight timeout to allow UI to update to "Simulating..." state
    setTimeout(() => {
      const generatedData = [];
      
      for (let i = 0; i < iterations; i++) {
        const rand = Math.random();
        let inclination, magnitude, model;

        // Apply Model Weights: Batygin (20%), Brown (40%), Siraj (40%)
        if (rand < 0.20) {
          model = 'Batygin (2019)';
          inclination = randomUniform(15, 25);
          magnitude = randomNormal(23.5, 0.8); // Approximated from paper's distant/faint tail
        } else if (rand < 0.60) {
          model = 'Brown (2021)';
          inclination = randomNormal(16, 5);
          magnitude = randomNormal(22.5, 0.7); // Approximated mid-range
        } else {
          model = 'Siraj (2025)';
          inclination = randomNormal(6.8, 5.0);
          magnitude = randomNormal(21.0, 0.6); // Approximated nearest/brightest
        }

        // Apply realistic bounds
        if (inclination < 0) inclination = Math.abs(inclination);
        
        // Determine LSST detectability (approximated threshold mr < 25.0)
        const detectable = magnitude < 25.0;

        generatedData.push({
          id: i,
          inclination: Number(inclination.toFixed(2)),
          magnitude: Number(magnitude.toFixed(2)),
          model,
          detectable
        });
      }

      setData(generatedData);
      setIsSimulating(false);
    }, 50);
  };

  return (
    <div className="border border-zinc-800 p-6 rounded-lg bg-[#121214] my-8 font-sans">
      <div className="flex justify-between items-end mb-6 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-zinc-300 font-mono text-xs uppercase tracking-widest mb-1">
            Monte Carlo Orbit Engine
          </h3>
          <p className="text-zinc-500 text-xs">
            N={iterations} • Mapping Inclination vs. Apparent Magnitude ($m_r$)
          </p>
        </div>
        <button 
          onClick={runSimulation}
          disabled={isSimulating}
          className="px-4 py-2 border border-zinc-700 hover:border-indigo-400 hover:text-indigo-400 text-xs font-mono text-zinc-300 transition-colors disabled:opacity-50"
        >
          {isSimulating ? '[ COMPUTING... ]' : '[ RUN SIMULATION ]'}
        </button>
      </div>

      <div className="h-96 w-full bg-[#0a0a0c] border border-zinc-800 rounded p-4">
        {data.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center text-zinc-600 font-mono text-xs">
            Awaiting execution parameters...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis 
                type="number" 
                dataKey="inclination" 
                name="Inclination" 
                unit="°" 
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12 }}
                domain={[0, 35]}
              />
              {/* Reversed Y-Axis because lower magnitude = brighter = easier to detect */}
              <YAxis 
                type="number" 
                dataKey="magnitude" 
                name="Apparent Mag (mr)" 
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 12 }}
                domain={[19, 27]}
                reversed
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3', stroke: '#52525b' }}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#e4e4e7', fontSize: '12px', fontFamily: 'monospace' }}
                itemStyle={{ color: '#818cf8' }}
              />
              
              {/* LSST Single Epoch Limit */}
              <ReferenceLine y={23.5} stroke="#3f3f46" strokeDasharray="3 3">
                <text x="5%" y="-5" fill="#71717a" fontSize="10" fontFamily="monospace">LSST SINGLE EPOCH LIMIT (23.5)</text>
              </ReferenceLine>
              
              {/* LSST Co-added / Shift-and-Stack Limit */}
              <ReferenceLine y={25.0} stroke="#ef4444" strokeDasharray="3 3">
                <text x="5%" y="-5" fill="#ef4444" fontSize="10" fontFamily="monospace">LSST MAX DEPTH LIMIT (25.0)</text>
              </ReferenceLine>

              <Scatter data={data} fill="#818cf8">
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.detectable ? (entry.model === 'Siraj (2025)' ? '#34d399' : '#818cf8') : '#52525b'} 
                    opacity={0.6}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      {data.length > 0 && (
        <div className="mt-4 flex gap-6 text-[10px] font-mono tracking-widest uppercase justify-center">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-[#34d399]"></span> Siraj (2025)
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-[#818cf8]"></span> Batygin/Brown
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-[#52525b]"></span> Undetectable ($m_r$ &gt; 25)
          </div>
        </div>
      )}
    </div>
  );
}