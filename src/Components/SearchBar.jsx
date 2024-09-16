import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const API_KEY = import.meta.env.VITE_AUTOCOMPLETE_API_KEY;

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://api.locationiq.com/v1/autocomplete.php?key=${API_KEY}&q=${value}&limit=5`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Autocomplete Error:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.display_name);
    setSuggestions([]);
    onSearch(suggestion.display_name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4 flex">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Enter city or ZIP code"
          className="flex-grow border p-2 rounded-l outline-none text-black"
        />
        <button type="submit" className="bg-gradient-to-r  text-white border p-2 rounded-r ">
          Search
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-black border rounded shadow-md w-full">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
