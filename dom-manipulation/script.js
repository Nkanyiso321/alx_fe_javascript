// Initialize quotes array from localStorage or default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Be yourself; everyone else is already taken.", category: "Inspiration" }
];

// Remember last selected category from localStorage
let lastCategory = localStorage.getItem('selectedCategory') || 'all';

// Populate dropdown with unique categories
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');

    // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Extract unique categories from quotes
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

    // Add quote to array and update localStorage
    quotes.push({ text, category });
    localStorage.setItem('quotes', JSON.stringify(quotes));

    // Update categories and refresh displayed quotes
    populateCategories();
    filterQuotes();

    // Clear input fields
    document.getElementById('quoteText').value = '';
    document.getElementById('quoteCategory').value = '';
}

// Filter quotes by selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;

    // Save selected category to localStorage
    lastCategory = selectedCategory;
    localStorage.setItem('selectedCategory', lastCategory);

    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    displayQuotes(filteredQuotes);
}

// Initialize page
window.onload = () => {
    populateCategories(); // Populate dropdown first
    filterQuotes();       // Then display quotes
};
