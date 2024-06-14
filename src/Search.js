import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/drugs?name=${query}`);
      const data = response.data.drugGroup.conceptGroup;
      if (data) {
        const names = data.flatMap(group => group.conceptProperties || []);
        setResults(names);
        setSuggestions([]);
        setError('');
      } else {
        handleSpellingSuggestions();
      }
    } catch (error) {
      console.error('Error fetching drugs:', error);
      setError('Failed to fetch drug data');
    }
  };

  const handleSpellingSuggestions = async () => {
    try {
      const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/spellingsuggestions?name=${query}`);
      const suggestions = response.data.suggestionGroup.suggestionList.suggestion || [];
      if (suggestions.length > 0) {
        setSuggestions(suggestions);
        setResults([]);
        setError('');
      } else {
        setError('No results found');
        setResults([]);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching spelling suggestions:', error);
      setError('Failed to fetch spelling suggestions');
    }
  };

  const handleResultClick = (name) => {
    navigate(`/drugs/${name}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for a drug"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div className="results">
        {results.map(result => (
          <div key={result.rxcui} onClick={() => handleResultClick(result.name)}>
            {result.name}
          </div>
        ))}
      </div>
      <div className="suggestions">
        {suggestions.map(suggestion => (
          <div key={suggestion} onClick={() => handleResultClick(suggestion)}>
            {suggestion}
          </div>
        ))}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Search;
