import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FiltersPage from './Components/FiltersPage';
import SecondPage from './Components/SecondPage';


const App: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<FiltersPage />} />
      <Route path='/second' element={<SecondPage />} />
    </Routes>
  );
};

export default App;
