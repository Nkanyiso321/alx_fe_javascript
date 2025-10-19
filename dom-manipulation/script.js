// ---------------------------
// Initialization
// ---------------------------

// Initialize quotes from localStorage or default
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Be yourself; everyone else is already taken.", category: "Inspiration" }
];

// Remember last selected category
let lastCategory = localStorage.getItem('selectedCategory') || 'all';

// ---------------------------
// Category Dropdown
// ---------------------------

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

// ---------------------------
// Display Quotes
// ---------------------------

function displayQuotes(filteredQuotes) {
    const quoteList = document.getElementById('quoteList');
    quoteList.innerHTML = '';

    filteredQuotes.forEach(q => {
        const li = document.createElement('li');
        li.textContent = `${q.text} [${q.category}]`;
        quoteList.appendChild(li);
    });
}

// ---------------------------
// Add Quote
// ---------------------------

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

// ---------------------------
// Filter Quotes
// ---------------------------

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

// ---------------------------
// Notification System
// ---------------------------

function showNotification(message) {
    const notif = document.getElementById("notification");
    notif.textContent = message;
    notif.style.display = "block";

    setTimeout(() => {
        notif.style.display = "none";
    }, 5000); // hide after 5 seconds
}

// ---------------------------
// Server Simulation & Sync
// ---------------------------

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API

async function fetchServerQuotes() {
    try {
        const response = await fetch(SERVER_URL);
        const data = await response.json();

        // Transform server data into quotes format
        const serverQuotes = data.slice(0, 5).map(item => ({
            text: item.title,
            category: "Server"
        }));

        return serverQuotes;
    } catch (error) {
        console.error("Failed to fetch server quotes:", error);
        return [];
    }
}

async function syncWithServer() {
    const serverQuotes = await fetchServerQuotes();
    let updated = false;

    serverQuotes.forEach(sq => {
        const exists = quotes.some(lq => lq.text === sq.text);
        if (!exists) {
            quotes.push(sq);
            updated = true;
        }
    });

    if (updated) {
        localStorage.setItem('quotes', JSON.stringify(quotes));
        populateCategories();
        filterQuote();
        showNotification("Quotes updated from server!");
    }
}

// ---------------------------
// Initialize Page & Periodic Sync
// ---------------------------

window.onload = () => {
    populateCategories();
    filterQuote();
    syncWithServer(); // Initial sync

    // Sync every 30 seconds
    setInterval(syncWithServer, 30000);
};
