import React, { useState } from 'react';

function AutocompleteInput({data, placeholder, setList}) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const filteredSuggestions = data.filter(item =>
      item.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setList(suggestion);
    setSuggestions([]);
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
      {suggestions.length > 0 && (
        <div className='AddressForm-group--dasentas'>
          {suggestions.map((suggestion, index) => (
            <label key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default AutocompleteInput;