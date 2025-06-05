import {useState } from 'react';
import  Home  from './components/Home';
import Weather from './components/Weather';
import './global.css';

type Screen = 'home' | 'weather';



export default function App() {
const [currentScreen, setCurrentScreen] = useState<Screen>('home');


const navigateToWeather = () => {
  setCurrentScreen('weather');
};
const navigateToHome = () => {
  setCurrentScreen('home');
};


  return (
    <>
   {currentScreen === 'home' && (
        <Home onNavigateToWeather={navigateToWeather} />
      )}
      {currentScreen === 'weather' && (
        <Weather onNavigateBack={navigateToHome} />
      )}
    </>
  );
}
