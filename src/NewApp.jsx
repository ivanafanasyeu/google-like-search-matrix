import { useState, useEffect, useRef } from "react";
import { useSearch } from "./hooks/useSearch";
import { useClickOutside } from "./hooks/useOutsideHandler";

function App() {
	const searchInputRef = useRef(null);
	const {
		setSearchHistory,
		handleSearch,
		searchQuery,
		handleRemoveItem,
		handleAutocompleteClick,
		handleChange,
		currentResults,
		autocompleteResults,
		searchPerformance,
	} = useSearch();

	const [isAutocompleteVisible, setIsAutocompleteVisible] = useState(false);
	const listRef = useRef(null);

	useEffect(() => {
		const storedSearchHistory = localStorage.getItem("searchHistory");
		if (storedSearchHistory) {
			setSearchHistory(JSON.parse(storedSearchHistory));
		}

		searchInputRef.current.focus();
	}, [setSearchHistory]);

	const handleSearchSubmit = () => {
		handleSearch(searchQuery);
	};

	const formRef = useRef(null);
	useClickOutside(formRef, () => setIsAutocompleteVisible(false));

	return (
		<main>
			<section className='search-section'>
				<div className='form' ref={formRef}>
					<input
						type='text'
						placeholder='Search Google'
						value={searchQuery}
						onChange={handleChange}
						ref={searchInputRef}
						onFocus={() => setIsAutocompleteVisible(true)}
					/>
					<button onClick={handleSearchSubmit}>SEARCH</button>
				</div>
				<ul className='autosuggested-list' ref={listRef}>
					{isAutocompleteVisible &&
						autocompleteResults.map((result, index) => (
							<li key={index}>
								<p
									data-inhistory={result.isHistory}
									onClick={() => handleAutocompleteClick(result)}
								>
									{result.title}
								</p>
								{result.isHistory && (
									<button onClick={() => handleRemoveItem(result.title)}>X</button>
								)}
							</li>
						))}
				</ul>
			</section>
			<section>
				<h2>Search Results</h2>
				{currentResults.length > 0 && (
					<p>
						Result meta data: {searchPerformance.resultsCount} results found in{" "}
						{searchPerformance.searchTime} ms.
					</p>
				)}
				<ul>
					{currentResults.map((result, index) => (
						<li key={index}>
							{/* It can be <a href={result.url}>{result.title}</a> */}
							<a href='#'>{result.title}</a>
							<p>{result.description}</p>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}

export default App;
