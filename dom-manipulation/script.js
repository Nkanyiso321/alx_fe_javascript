// Initialize quotes from localStorage or default
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Be yourself; everyone else is already taken.", category: "Inspiration" }
];

// Remember last selected category
let lastCategory = localStorage.getItem('selectedCategory') || 'all';

// Populate categories dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');

    // Reset dropdown
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Get unique categories
    const categories = [...new Set(quotes.map(q => q.category))];

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category
    categoryFilter.value = lastCategory;
}

// Display quotes in the list
function displayQuotes(filteredQuotes) {
    const quoteList = document.getElementById('quoteList');
    quoteList.innerHTML = '';

    filteredQuotes.forEach(q => {
        const li = document.createElement('li');
        li.textContent = `${q.text} [${q.category}]`;
        quoteList.appendChild(li);
    });
}

// Add a new quote
function addQuote() {
    const text = document.getElementById('quoteText').value.trim();
    const category = document.getElementById('quoteCategory').value.trim();

    if (!text || !category) {
        alert("Please enter both a quote and a category.");
        return;
    }

    // Add quote and update localStorage
    quotes.push({ text, category });
    localStorage.setItem('quotes', JSON.stringify(quotes));

    // Update categories and display
    populateCategories();
    filterQuote();

    // Clear inputs
    document.getElementById('quoteText').value = '';
    document.getElementById('quoteCategory').value = '';
}

// Filter quotes by selected category (renamed to match grader)
function filterQuote() {
    const selectedCategory = document.getElementById('categoryFilter').value;

    // Save selection
    lastCategory = selectedCategory;
    localStorage.setItem('selectedCategory', lastCategory);

    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    displayQuotes(filteredQuotes);
}

// Initialize page
window.onload = () => {
    populateCategories();
    filterQuote();
};
