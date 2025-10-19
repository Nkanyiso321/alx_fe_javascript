// Array to store quotes
let quotes = [];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const exportQuotesButton = document.getElementById('exportQuotes');

// Load quotes from local storage on initialization
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        // Default quotes if none in storage
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Motivation" },
            { text: "Life is what happens when you're busy making other plans.", category: "Life" },
            { text: "Stay hungry, stay foolish.", category: "Motivation" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" }
        ];
    }
    updateCategoryFilter();
    showRandomQuote();
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    updateCategoryFilter();
}

// Save last viewed quote to session storage
function saveLastQuote(quote) {
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// Load last viewed quote from session storage
function loadLastQuote() {
    const lastQuote = sessionStorage.getItem('lastQuote');
    if (lastQuote) {
        const quote = JSON.parse(lastQuote);
        displayQuote(quote);
    } else {
        showRandomQuote();
    }
}

// Display a specific quote
function displayQuote(quote) {
    const quoteElement = document.createElement('div');
    quoteElement.className = 'quote';
    
    const quoteText = document.createElement('p');
    quoteText.textContent = `"${quote.text}"`;
    
    const quoteCategory = document.createElement('p');
    quoteCategory.style.fontStyle = 'italic';
    quoteCategory.textContent = `- ${quote.category}`;

    quoteElement.appendChild(quoteText);
    quoteElement.appendChild(quoteCategory);
    
    quoteDisplay.innerHTML = '';
    quoteDisplay.appendChild(quoteElement);
}

// Show random quote
function showRandomQuote() {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available for this category.</p>';
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    
    displayQuote(randomQuote);
    saveLastQuote(randomQuote);
}

// Update category filter
function updateCategoryFilter() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Add new quote
function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (!text || !category) {
        alert('Please enter both a quote and a category');
        return;
    }

    quotes.push({ text, category });
    saveQuotes();

    newQuoteText.value = '';
    newQuoteCategory.value = '';

    const successMessage = document.createElement('p');
    successMessage.textContent = 'Quote added successfully!';
    successMessage.style.color = 'green';
    quoteDisplay.innerHTML = '';
    quoteDisplay.appendChild(successMessage);

    setTimeout(() => {
        showRandomQuote();
    }, 2000);
}

// Export quotes to JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (!Array.isArray(importedQuotes) || !importedQuotes.every(q => q.text && q.category)) {
                alert('Invalid JSON format. Each quote must have a text and category.');
                return;
            }
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
            showRandomQuote();
        } catch (e) {
            alert('Error parsing JSON file. Please ensure it’s valid JSON.');
        }
    };
    fileReader.readAsText(file);
}

// Initialize application
loadQuotes();

// Event listeners
newQuoteButton.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', showRandomQuote);
exportQuotesButton.addEventListener('click', exportToJsonFile);
