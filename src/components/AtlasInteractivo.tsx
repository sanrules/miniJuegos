import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../hooks/useSpeech';
import { countries, continentNames, type Country } from '../data/countries';
import { FLAG_BASE } from '../utils/game';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const countryByNum = new Map<number, Country>(countries.map(c => [c.numCode, c]));

const countryCoords: Record<string, [number, number]> = {
  es: [-3.7, 40.4], fr: [2.2, 46.6], de: [10.5, 51.2], it: [12.5, 41.9],
  pt: [-8.2, 39.4], gb: [-3.4, 55.4], pl: [19.1, 51.9], nl: [5.3, 52.1],
  be: [4.5, 50.8], se: [15.0, 62.0], no: [10.0, 62.0], fi: [26.0, 64.0],
  dk: [10.0, 56.0], at: [14.5, 47.5], ch: [7.8, 46.8],
  jp: [138.3, 36.2], cn: [104.2, 35.0], in: [78.0, 20.0], kr: [128.0, 36.0],
  sa: [45.0, 24.0], th: [101.0, 15.0], vn: [106.0, 16.0], id: [113.0, -5.0],
  my: [112.0, 4.0], sg: [104.0, 1.0],
  za: [25.0, -30.0], eg: [30.0, 27.0], ng: [8.0, 8.0], ke: [38.0, 0.0],
  ma: [-7.0, 32.0], gh: [-1.0, 8.0], et: [39.0, 9.0], tz: [35.0, -6.0],
  us: [-100.0, 40.0], br: [-55.0, -14.0], ar: [-63.0, -35.0],
  mx: [-102.0, 23.0], ca: [-100.0, 56.0], co: [-74.0, 4.0],
  pe: [-75.0, -10.0], cl: [-70.0, -35.0], ve: [-66.0, 6.0],
  ec: [-78.0, -1.0], bo: [-66.0, -16.0],
  au: [134.0, -25.0], nz: [174.0, -41.0], fj: [178.0, -17.0], pg: [145.0, -7.0],
};

export function AtlasInteractivo({ onBack }: { onBack: () => void }) {
  const { speak } = useSpeech();
  const [selected, setSelected] = useState<Country | null>(null);

  const handleSelect = (country: Country) => {
    setSelected(country);
    speak(`¡Has tocado ${country.name}! Su capital es ${country.capital} y está en ${continentNames[country.continent]}`);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-100 overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={onBack}
          className="flex items-center gap-1.5 p-3 bg-white/90 rounded-xl shadow-md backdrop-blur-sm active:scale-95 transition-all">
          <span className="text-2xl">⬅️</span>
          <span className="text-sm font-bold text-gray-600">Atrás</span>
        </button>
      </div>

      <div className="w-full h-screen">
        <ComposableMap width={800} height={600} style={{ width: '100%', height: '100%' }}
          projection="geoEqualEarth" projectionConfig={{ scale: 180, center: [0, 20] }}>
          <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={5}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) => geographies.map(geo => {
                const country = countryByNum.get(Number(geo.id));
                const isSelected = selected && country?.code === selected.code;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => { if (country) handleSelect(country); }}
                    id={String(geo.id)}
                    style={{
                      default: {
                        fill: isSelected ? '#fcd34d' : country ? '#86efac' : '#f1f5f9',
                        stroke: isSelected ? '#f97316' : '#cbd5e1',
                        strokeWidth: isSelected ? 3 : 0.5,
                        outline: 'none',
                      },
                      hover: { fill: '#93c5fd', stroke: '#3b82f6', strokeWidth: 1.5, outline: 'none' },
                      pressed: { fill: '#60a5fa', stroke: '#2563eb', strokeWidth: 2, outline: 'none' },
                    }}
                  />
                );
              })}
            </Geographies>

            {countries.map(c => {
              const pos = countryCoords[c.code.toLowerCase()];
              if (!pos) return null;
              return (
                <Marker key={c.code} coordinates={pos}>
                  <g onClick={(e) => { e.stopPropagation(); handleSelect(c); }} style={{ cursor: 'pointer' }}>
                    <circle r={13} fill="white" stroke="#94a3b8" strokeWidth={1.5} />
                    <image href={`${FLAG_BASE}/${c.code.toLowerCase()}.svg`} x={-10} y={-7} width={20} height={14}
                      style={{ pointerEvents: 'none' }} />
                  </g>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div key={selected.code} initial={{ y: 250, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }} exit={{ y: 250, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md rounded-t-3xl shadow-2xl border-t-4 border-yellow-400 p-6 pb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏷️</span>
              <img src={`${FLAG_BASE}/${selected.code.toLowerCase()}.svg`}
                className="w-20 h-14 shadow-md rounded-lg border border-gray-200" alt="" />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🏛️</span>
              <span className="text-3xl font-bold text-gray-800">{selected.capital}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌍</span>
              <span className="text-xl text-gray-600 font-medium">{continentNames[selected.continent]}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}