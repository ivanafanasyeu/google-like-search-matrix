import { useState } from "react";

import { debounce } from "../debounce";
import { MOCK_DB } from "../db";

export function useSearch() {
	const [searchQuery, setSearchQuery] = useState("");
	const [currentResults, setCurrentResults] = useState([]);
	const [autocompleteResults, setAutocompleteResults] = useState([]);
	const [searchHistory, setSearchHistory] = useState([]);
	const [searchPerformance, setSearchPerformance] = useState({ resultsCount: 0, searchTime: 0 });

	const handleSearch = query => {
		const start = performance.now();
		const matchingResults = MOCK_DB.filter(
			result =>
				result.title.toLowerCase().includes(query.toLowerCase()) ||
				result.description.toLowerCase().includes(query.toLowerCase()),
		);
		const end = performance.now();

		setCurrentResults(matchingResults);

		if (!searchHistory.includes(query)) {
			const updatedHistory = [query, ...searchHistory];
			setSearchHistory(updatedHistory);
			localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
		}

		setSearchPerformance({
			resultsCount: matchingResults.length,
			searchTime: (end - start).toFixed(2),
		});
	};

	const handleAutocomplete = query => {
		const historyResults = searchHistory
			.filter(historyItem => historyItem.includes(query))
			.map(historyItem => ({ title: historyItem, isHistory: true }));

		const matchingResults = MOCK_DB.filter(
			result =>
				result.title.toLowerCase().includes(query.toLowerCase()) ||
				result.description.toLowerCase().includes(query.toLowerCase()),
		);

		const autocompleteItems = [...historyResults, ...matchingResults].slice(0, 10);
		setAutocompleteResults(autocompleteItems);
	};

	const debouncedAutocomplete = debounce(handleAutocomplete, 300);
	const handleChange = e => {
		const query = e.target.value;
		setSearchQuery(query);
		debouncedAutocomplete(query);
	};

	const handleAutocompleteClick = result => {
		setSearchQuery(result.title);
		setAutocompleteResults([]);
		handleSearch(result.title);
	};

	const handleRemoveItem = item => {
		const updatedHistory = searchHistory.filter(historyItem => historyItem !== item);
		setSearchHistory(updatedHistory);
		localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
		setAutocompleteResults(prevResults => {
			return prevResults.filter(result => result.title !== item);
		});
	};

	return {
		setSearchHistory,
		handleSearch,
		searchQuery,
		handleRemoveItem,
		handleAutocompleteClick,
		handleChange,
		currentResults,
		autocompleteResults,
		searchPerformance,
	};
}
