import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech.ts';
import { countries, continentNames, type Country, type Continent } from '../../data/countries.ts';
import { FLAG_BASE } from '../../utils/game.ts';
import { BackButton } from './BackButton.tsx';
import { animals } from '../../data/animals.ts';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const countryByNum = new Map<number, Country>(countries.map(c => [c.numCode, c]));

const countryCoords: Record<string, [number, number]> = {
  af: [66, 34], ao: [17, -12], dz: [3, 28], bj: [2.5, 9.5], bw: [24, -22],
  bf: [-1.5, 12.5], bi: [30, -3.5], cv: [-24, 16], cm: [12, 6], td: [18, 15],
  km: [43, -12], ci: [-5, 7.5], eg: [30, 27], er: [39, 15], et: [39, 9],
  ga: [11, -1], gm: [-16, 13.5], gh: [-1, 8], gn: [-11, 10], gq: [10, 1.5],
  gw: [-15, 12], ke: [38, 0], ls: [28.5, -29.5], lr: [-10, 6.5], ly: [17, 26],
  mg: [47, -20], mw: [34, -13.5], ml: [-3, 17], ma: [-7, 32], mu: [57.5, -20.3],
  mr: [-11, 20], mz: [35, -18], na: [17, -22], ne: [9, 17.5], ng: [8, 8],
  cf: [21, 7], cg: [15, -1], cd: [24, -2], rw: [30, -2], st: [7, 1],
  sn: [-14.5, 14], sc: [55, -5], sl: [-12, 8.5], so: [46, 6], sz: [31.5, -26.5],
  za: [25, -30], sd: [31, 15], ss: [31, 7], tz: [35, -6], tg: [1, 8.5],
  tn: [9, 34], ug: [32, 1], dj: [43, 11.5], zm: [28, -14], zw: [30, -19],
  al: [20, 41], ad: [1.5, 42.5], at: [14.5, 47.5], by: [28, 53.5],
  be: [4.2, 50.6], ba: [17.7, 44.3], bg: [25, 42.5], hr: [15.7, 45.2], cy: [33, 35],
  cz: [15.8, 49.5], dk: [10, 56], ee: [25, 58.5], fi: [26, 64],
  fr: [2.2, 46.6], de: [10.5, 51.2], gr: [22, 39], hu: [19.8, 46.7],
  is: [-18, 65], ie: [-8, 53], it: [12.0, 42.0], xk: [20.4, 42.3],
  lv: [25, 57], li: [9.5, 47.2], lt: [24, 55], lu: [6.3, 49.5], mt: [14.5, 35.9],
  md: [28.5, 47], mc: [7.4, 43.7], me: [19.0, 43.2], nl: [5.0, 52.5],
  mk: [22.2, 41.8], no: [10, 62], pl: [19.1, 51.9], pt: [-8.2, 39.4],
  ro: [25, 46], ru: [40, 60], sm: [12.8, 44.2], rs: [21.3, 43.7], sk: [19.2, 49.0],
  si: [15.1, 45.8], es: [-3.7, 40.4], se: [15, 62], ch: [7.8, 46.8],
  tr: [35, 39], ua: [31, 49], gb: [-3.4, 55.4], va: [12.3, 41.7],
  am: [44.5, 40.2], az: [47.5, 40.3], bh: [50.5, 26], bd: [90, 24],
  bt: [89.5, 27.5], bn: [115, 4.5], kh: [105, 13], cn: [104.2, 35],
  tl: [126, -8.5], ge: [43, 42], in: [78, 20], id: [113, -5], ir: [54, 32],
  iq: [44, 33], il: [34.8, 31.5], jp: [138.3, 36.2], jo: [36, 31],
  kz: [66, 48], kw: [48, 29.3], kg: [74.5, 41.5], la: [103, 18],
  lb: [35.8, 33.9], my: [112, 4], mv: [73.5, 3], mn: [103, 46], mm: [97, 21],
  np: [84, 28], kp: [127, 40], om: [57, 21], pk: [70, 30], ps: [35.2, 31.9],
  ph: [122, 12], qa: [51, 25.5], sa: [45, 24], sg: [104, 1], kr: [128, 36],
  lk: [81, 7.5], sy: [39, 35], tj: [71, 38.5], th: [101, 15], tm: [59, 39],
  ae: [54, 24], uz: [64, 41.5], vn: [106, 16], ye: [48, 15.5],
  ag: [-61.8, 17.1], ar: [-63, -35], bs: [-77, 25], bb: [-59.5, 13.2],
  bz: [-88.5, 17], bo: [-66, -16], br: [-55, -14], ca: [-100, 56],
  cl: [-70, -35], co: [-74, 4], cr: [-84, 10], cu: [-78, 21.5],
  dm: [-61.4, 15.4], do: [-70, 19], ec: [-78, -1], sv: [-89, 13.8],
  gd: [-61.7, 12.1], gt: [-90, 15.5], gy: [-59, 5], ht: [-72.5, 19],
  hn: [-86.5, 14], jm: [-77.5, 18], mx: [-102, 23], ni: [-85, 12.5],
  pa: [-80, 8.5], py: [-58.5, -23], pe: [-75, -10], kn: [-62.7, 17.3],
  lc: [-61, 13.9], vc: [-61.2, 13], sr: [-56, 4], tt: [-61, 10.5],
  us: [-100, 40], uy: [-56, -32.5], ve: [-66, 6],
  au: [134, -25], fj: [178, -17], ki: [173, 1], mh: [171, 7],
  fm: [158, 7], nr: [167, -0.5], nz: [174, -41], pw: [134.5, 7.5],
  pg: [145, -7], ws: [-172, -13.5], sb: [160, -8], to: [-175, -21],
  tv: [179, -8.5], vu: [167, -16],
};

const continentConfig: Record<Continent, { center: [number, number]; zoom: number }> = {
  EU: { center: [15, 50], zoom: 3.5 },
  AS: { center: [90, 30], zoom: 2.5 },
  AF: { center: [20, 5], zoom: 2.8 },
  AM: { center: [-80, 15], zoom: 2.5 },
  OC: { center: [150, -25], zoom: 3.5 },
};

type View = 'world' | Continent;

export function AtlasInteractivo({ onBack }: { onBack: () => void }) {
  const { speak } = useSpeech();
  const [view, setView] = useState<View>('world');
  const [selected, setSelected] = useState<Country | null>(null);

  const isWorld = view === 'world';
  const zoom = isWorld ? 1 : continentConfig[view].zoom;
  const center: [number, number] = isWorld ? [0, 20] : continentConfig[view].center;
  const markerSize = isWorld ? 20 : 12;
  const countryAnimals = selected
    ? animals.filter(a => a.countryCodes.includes(selected.code))
    : [];

  const visibleCountries = isWorld
    ? countries.filter(c => c.difficulty === 1)
    : countries.filter(c => c.continent === view);

  const handleGeographyClick = (country: Country | undefined) => {
    if (!country) return;
    if (isWorld) {
      setView(country.continent);
      setSelected(null);
    } else {
      setSelected(country);
      speak(`¡Has tocado ${country.name}! Su capital es ${country.capital} y está en ${continentNames[country.continent]}`);
    }
  };

  const handleMarkerClick = (country: Country) => {
    setSelected(country);
    speak(`¡Has tocado ${country.name}! Su capital es ${country.capital} y está en ${continentNames[country.continent]}`);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-100 overflow-hidden">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
<BackButton onClick={onBack} className="bg-white/90 backdrop-blur-sm" />
        {!isWorld && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => { setView('world'); setSelected(null); }}
            className="p-3 bg-white/90 rounded-xl shadow-md backdrop-blur-sm active:scale-95 transition-all text-2xl"
            aria-label="Vista mundial"
          >
            🌍
          </motion.button>
        )}
      </div>

      <div className="w-full h-screen">
        <ComposableMap width={800} height={600} style={{ width: '100%', height: '100%' }}
          projection="geoEqualEarth" projectionConfig={{ scale: 180, center: [0, 20] }}>
          <ZoomableGroup zoom={zoom} center={center} minZoom={0.8} maxZoom={5}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) => geographies.map(geo => {
                const country = countryByNum.get(Number(geo.id));
                const isSelected = selected && country?.code === selected.code;
                const isInContinent = country && (isWorld || country.continent === view);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleGeographyClick(country)}
                    id={String(geo.id)}
                    style={{
                      default: {
                        fill: isSelected ? '#fcd34d' : isInContinent ? '#86efac' : '#f1f5f9',
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

            {visibleCountries.map(c => {
              const pos = countryCoords[c.code.toLowerCase()];
              if (!pos) return null;
              return (
                <Marker key={c.code} coordinates={pos}>
                  <motion.g
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    onClick={(e) => { e.stopPropagation(); handleMarkerClick(c); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle r={markerSize / 2 + 3} fill="white" stroke="#94a3b8" strokeWidth={1.5} />
                    <image href={`${FLAG_BASE}/${c.code.toLowerCase()}.svg`}
                      x={-markerSize / 2} y={-markerSize / 2 + 1} width={markerSize} height={markerSize * 0.7}
                      style={{ pointerEvents: 'none' }} />
                  </motion.g>
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
              <span className="text-2xl font-bold text-gray-800">{selected.name}</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🏛️</span>
              <span className="text-3xl font-bold text-gray-800">{selected.capital}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌍</span>
              <span className="text-xl text-gray-600 font-medium">{continentNames[selected.continent]}</span>
            </div>
            {countryAnimals.length > 0 && (
              <div className="flex items-center gap-3 mt-3">
                <span className="text-3xl">🐾</span>
                <div className="flex gap-1.5 flex-wrap">
                  {countryAnimals.map(a => (
                    <span key={a.emoji} className="text-3xl" title={a.name}>{a.emoji}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
