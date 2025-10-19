// Array to store quotes
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Stay hungry, stay foolish.", category: "Motivation" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

// Function to show random quote
function showRandomQuote() {
    // Get selected category
    const selectedCategory = categoryFilter.value;
    
    // Filter quotes by category
    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available for this category.</p>';
        return;
    }

    // Get random quote
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    // Create quote element
    const quoteElement = document.createElement('div');
    quoteElement.className = 'quote';
    
    // Create quote text element
    const quoteText = document.createElement('p');
    quoteText.textContent = `"${randomQuote.text}"`;
    
    // Create category element
    const quoteCategory = document.createElement('p');
    quoteCategory.style.fontStyle = 'italic';
    quoteCategory.textContent = `- ${randomQuote.category}`;

    // Append elements
    quoteElement.appendChild(quoteText);
    quoteElement.appendChild(quoteCategory);
    
    // Clear and update display
    quoteDisplay.innerHTML = '';
    quoteDisplay.appendChild(quoteElement);
}

// Function to create and update category filter
function updateCategoryFilter() {
    // Get unique categories
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    // Clear existing options except 'all'
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Add new category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to add new quote
function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    // Validate inputs
    if (!text || !category) {
        alert('Please enter both a quote and a category');
        return;
    }

    // Add new quote to array
    quotes.push({ text, category });

    // Clear inputs
    newQuoteText.value = '';
    newQuoteCategory.value = '';

    // Update category filter
    updateCategoryFilter();

    // Show success message
    const successMessage = document.createElement('p');
    successMessage.textContent = 'Quote added successfully!';
    successMessage.style.color = 'green';
    quoteDisplay.innerHTML = '';
    quoteDisplay.appendChild(successMessage);

    // Remove success message after 2 seconds
    setTimeout(() => {
        quoteDisplay.innerHTML = '';
    }, 2000);
}

// Initialize category filter
updateCategoryFilter();

// Event listeners
newQuoteButton.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', showRandomQuote);

// Show initial quote
showRandomQuote();
