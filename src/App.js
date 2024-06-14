import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Search from './Search';
import DrugDetail from './DrugDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/drugs/search" element={<Search />} />
          <Route path="/drugs/:drugName" element={<DrugDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
