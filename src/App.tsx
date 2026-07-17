import {useCallback, useRef, useState} from 'react';
import {AnimalIntruso} from "./components/animales/AnimalIntruso.tsx";
import {AnimalMenu} from "./components/animales/AnimalMenu.tsx";
import {AnimalParejas} from "./components/animales/AnimalParejas.tsx";
import {AnimalRasca} from "./components/animales/AnimalRasca.tsx";
import {BosqueSonidos} from "./components/animales/BosqueSonidos.tsx";
import {SafariBusca} from "./components/animales/SafariBusca.tsx";
import {AnimalesJuego} from "./components/comunes/AnimalesJuego.tsx";
import {AtlasInteractivo} from "./components/comunes/AtlasInteractivo.tsx";
import {Celebration} from "./components/comunes/Celebration.tsx";
import {GameId, GameSelection} from "./components/comunes/GameSelection.tsx";
import {LevelSelection} from "./components/comunes/LevelSelection.tsx";
import {WorldSelector} from "./components/comunes/WorldSelector.tsx";
import {AdivinaJuego} from "./components/paises/AdivinaJuego.tsx";
import {IntrusoJuego} from "./components/paises/IntrusoJuego.tsx";
import {MapSelection} from "./components/paises/MapSelection.tsx";
import {ParejasJuego} from "./components/paises/ParejasJuego.tsx";
import {PuzleJuego} from "./components/paises/PuzleJuego.tsx";
import {RascaJuego} from "./components/paises/RascaJuego.tsx";
import {type Continent, countries, type Country, type Level} from './data/countries';

type Screen =
    | { type: 'worldSelector' }
    | { type: 'atlas' }
    | { type: 'level' }
    | { type: 'map'; level: Level }
    | { type: 'gameSelection'; level: Level; continent: Continent | null }
    | { type: 'game'; level: Level; game: GameId; continent: Continent | null }
    | { type: 'celebration'; score: number; game: GameId; level: Level; continent: Continent | null }
    | { type: 'animalsMenu' }
    | { type: 'animalsBosque' }
    | { type: 'animalsSafari' }
    | { type: 'animalsParejas' }
    | { type: 'animalsRasca' }
    | { type: 'animalsIntruso' };

function getPool(level: Level, continent: Continent | null): Country[] {
    if (level === 'explorer') return countries.filter(c => c.difficulty === 1);
    if (level === 'continents' && continent) return countries.filter(c => c.continent === continent);
    return countries;
}

export default function App() {
    const [screen, setScreen] = useState<Screen>({type: 'worldSelector'});
    const navigateRef = useRef(false);
    const navigate = useCallback((s: Screen) => {
        if (navigateRef.current) return;
        navigateRef.current = true;
        setScreen(s);
        setTimeout(() => { navigateRef.current = false; }, 400);
    }, []);

    switch (screen.type) {
        case 'worldSelector':
            return <WorldSelector
                onSelectFlags={() => navigate({type: 'level'})}
                onSelectAnimals={() => navigate({type: 'animalsMenu'})}
                onSelectAtlas={() => navigate({type: 'atlas'})}/>;

        case 'atlas':
            return <AtlasInteractivo onBack={() => navigate({type: 'worldSelector'})}/>;

        case 'level':
            return (
                <LevelSelection onSelect={(level) => {
                    if (level === 'continents') navigate({type: 'map', level});
                    else navigate({type: 'gameSelection', level, continent: null});
                }} onBack={() => navigate({type: 'worldSelector'})}/>
            );

        case 'map':
            return (
                <MapSelection
                    onSelectContinent={(continent) => navigate({type: 'gameSelection', level: screen.level, continent})}
                    onBack={() => navigate({type: 'level'})}/>
            );

        case 'gameSelection':
            return (
                <GameSelection level={screen.level} continent={screen.continent}
                               onSelectGame={(game) => navigate({type:         'game',
                                                                    level:     screen.level,
                                                                    game,
                                                                    continent: screen.continent
                                                                })}
                               onBack={() => navigate({type: 'level'})}/>
            );

        case 'game': {
            const pool = getPool(screen.level, screen.continent);
            const back = () => navigate({type: 'gameSelection', level: screen.level, continent: screen.continent});
            const finish = (score: number) => navigate({type:         'celebration',
                                                           score,
                                                           game:      screen.game,
                                                           level:     screen.level,
                                                           continent: screen.continent
                                                       });
            const shared = {level: screen.level, poolCountries: pool, onBack: back, onFinish: finish};

            switch (screen.game) {
                case 'adivina':
                    return <AdivinaJuego {...shared} />;
                case 'parejas':
                    return <ParejasJuego {...shared} />;
                case 'rasca':
                    return <RascaJuego {...shared} />;
                case 'intruso':
                    return <IntrusoJuego {...shared} />;
                case 'puzle':
                    return <PuzleJuego {...shared} />;
                case 'animales':
                    return <AnimalesJuego {...shared} />;
            }
            return null;
        }

        case 'animalsMenu':
            return <AnimalMenu
                onSelectBosque={() => navigate({type: 'animalsBosque'})}
                onSelectSafari={() => navigate({type: 'animalsSafari'})}
                onSelectParejas={() => navigate({type: 'animalsParejas'})}
                onSelectRasca={() => navigate({type: 'animalsRasca'})}
                onSelectIntruso={() => navigate({type: 'animalsIntruso'})}
                onBack={() => navigate({type: 'worldSelector'})}/>;

        case 'animalsBosque':
            return <BosqueSonidos onBack={() => navigate({type: 'animalsMenu'})}/>;

        case 'animalsSafari':
            return <SafariBusca onBack={() => navigate({type: 'animalsMenu'})}/>;

        case 'animalsParejas':
            return <AnimalParejas onBack={() => navigate({type: 'animalsMenu'})}/>;

        case 'animalsRasca':
            return <AnimalRasca onBack={() => navigate({type: 'animalsMenu'})}/>;

        case 'animalsIntruso':
            return <AnimalIntruso onBack={() => navigate({type: 'animalsMenu'})}/>;

        case 'celebration':
            return (
                <Celebration score={screen.score}
                             onContinue={() => navigate({type:         'gameSelection',
                                                             level:     screen.level,
                                                             continent: screen.continent
                                                         })}/>
            );
    }
}
