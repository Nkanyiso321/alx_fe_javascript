let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Be yourself; everyone else is already taken.", category: "Inspiration" }
];

let lastCategory = localStorage.getItem('selectedCategory') || 'all';

function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
    categoryFilter.value = lastCategory;
}

function displayQuotes(filteredQuotes) {
    const quoteList = document.getElementById('quoteList');
    quoteList.innerHTML = '';
    filteredQuotes.forEach(q => {
        const li = document.createElement('li');
        li.textContent = `${q.text} [${q.category}]`;
        quoteList.appendChild(li);
    });
}

function addQuote() {
    const text = document.getElementById('quoteText').value.trim();
    const category = document.getElementById('quoteCategory').value.trim();
    if (!text || !category) {
        alert("Please enter both a quote and a category.");
        return;
    }
    quotes.push({ text, category });
    localStorage.setItem('quotes', JSON.stringify(quotes));
    populateCategories();
    filterQuotes();
    document.getElementById('quoteText').value = '';
    document.getElementById('quoteCategory').value = '';
}

function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    lastCategory = selectedCategory;
    localStorage.setItem('selectedCategory', lastCategory);
    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);
    displayQuotes(filteredQuotes);
}

window.onload = () => {
    populateCategories();
    filterQuotes();
};
