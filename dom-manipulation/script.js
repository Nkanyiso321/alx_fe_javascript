// Initial quotes array (fallback if local storage is empty)
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "The journey of a thousand miles begins with a single step.", category: "Inspiration" }
];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to save the last viewed quote to session storage
function saveLastQuote(quote) {
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// Function to load the last viewed quote from session storage
function loadLastQuote() {
  const lastQuote = sessionStorage.getItem('lastQuote');
  return lastQuote ? JSON.parse(lastQuote) : null;
}

// Function to save the selected category filter to local storage
function saveSelectedCategory(category) {
  localStorage.setItem('selectedCategory', category);
}

// Function to load the selected category filter from local storage
function loadSelectedCategory() {
  return localStorage.getItem('selectedCategory') || 'all';
}

// Function to show notification
function showNotification(message, isError = false) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.color = isError ? 'red' : 'green';
  setTimeout(() => { notification.textContent = ''; }, 5000);
}

// Function to show conflict resolution UI
function showConflictResolution() {
  document.getElementById('conflictResolution').style.display = 'block';
}

// Function to hide conflict resolution UI
function hideConflictResolution() {
  document.getElementById('conflictResolution').style.display = 'none';
}

// Function to resolve conflict by keeping local data
function resolveKeepLocal() {
  hideConflictResolution();
  showNotification('Conflict resolved: Kept local data.');
}

// Function to resolve conflict by accepting server data
function resolveKeepServer() {
  syncData(true); // Force accept server
  hideConflictResolution();
  showNotification('Conflict resolved: Accepted server data.');
}

// Function to fetch quotes from server (JSONPlaceholder)
async function fetchServerQuotes() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) throw new Error('Server fetch failed');
    const serverPosts = await response.json();
    // Map posts to quotes: title -> category, body -> text
    return serverPosts.map(post => ({ text: post.body, category: post.title }));
  } catch (error) {
    console.error('Error fetching from server:', error);
    showNotification('Server fetch error. Using local data.', true);
    return [];
  }
}

// Function to push new local quotes to server (mock, non-persisting)
async function pushLocalQuotes(newQuotes) {
  try {
    for (const quote of newQuotes) {
      await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: quote.category, body: quote.text })
      });
    }
    showNotification(`${newQuotes.length} new quotes pushed to server.`);
  } catch (error) {
    console.error('Error pushing to server:', error);
    showNotification('Server push error.', true);
  }
}

// Function to detect conflicts (simple: compare lengths)
function detectConflict(localQuotes, serverQuotes) {
  return serverQuotes.length > localQuotes.length;
}

// Function to sync data: Pull from server, resolve conflicts, push new locals
async function syncData(forceAcceptServer = false) {
  const serverQuotes = await fetchServerQuotes();
  if (serverQuotes.length === 0) {
    showNotification('No server data available.');
    return;
  }

  const hasConflict = detectConflict(quotes, serverQuotes);
  if (hasConflict && !forceAcceptServer) {
    showNotification('Conflict detected! Check resolution options.');
    showConflictResolution();
    return;
  }

  // Server takes precedence: merge server into local (add missing, overwrite if conflict)
  const mergedQuotes = [...serverQuotes];
  quotes.forEach(localQuote => {
    const exists = mergedQuotes.some(sq => sq.text === localQuote.text && sq.category === localQuote.category);
    if (!exists) {
      mergedQuotes.push(localQuote);
    }
  });
  quotes = mergedQuotes;
  saveQuotes();

  // Push any new local quotes that weren't in server (in case of prior sync)
  const newLocals = quotes.filter(lq => !serverQuotes.some(sq => sq.text === lq.text && sq.category === lq.category));
  if (newLocals.length > 0) {
    await pushLocalQuotes(newLocals);
  }

  // Update UI
  populateCategories();
  filterQuotes();
  showNotification('Data synced successfully!');
}

// Manual sync trigger
function manualSync() {
  syncData();
}

// Periodic sync (every 30 seconds)
setInterval(() => {
  syncData();
}, 30000);

// Function to populate the category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  // Get unique categories
  const categories = [...new Set(quotes.map(quote => quote.category))];
  
  // Preserve the selected value
  const selectedValue = categoryFilter.value;
  
  // Clear existing options except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  // Add unique categories to the dropdown
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  // Restore the selected value or set to saved category
  categoryFilter.value = selectedValue && categories.includes(selectedValue) ? selectedValue : loadSelectedCategory();
}

// Function to filter and display quotes based on the selected category
function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;
  
  // Save the selected category to local storage
  saveSelectedCategory(selectedCategory);
  
  // Filter quotes based on the selected category
  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);
  
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = ''; // Clear previous content
  
  if (filteredQuotes.length === 0) {
    const noQuotes = document.createElement('p');
    noQuotes.textContent = 'No quotes available for this category.';
    quoteDisplay.appendChild(noQuotes);
    return;
  }
  
  // Select a random quote from filtered quotes
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  
  // Create elements for quote text and category
  const quoteText = document.createElement('p');
  quoteText.textContent = `"${quote.text}"`;
  quoteText.style.fontStyle = 'italic';
  
  const quoteCategory = document.createElement('p');
  quoteCategory.textContent = `— ${quote.category}`;
  quoteCategory.style.fontWeight = 'bold';
  
  // Append elements to quoteDisplay
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
  
  // Save the displayed quote to session storage
  saveLastQuote(quote);
}

// Function to create and append the add quote form and import/export buttons
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
    <button onclick="exportQuotes()">Export Quotes</button>
    <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
  `;
  document.body.appendChild(formContainer);
}

// Function to add a new quote
async function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();
  
  // Validate inputs
  if (quoteText === '' || quoteCategory === '') {
    alert('Please enter both a quote and a category.');
    return;
  }
  
  // Add new quote to the quotes array
  quotes.push({ text: quoteText, category: quoteCategory });
  
  // Save to local storage
  saveQuotes();
  
  // Update categories in the dropdown
  populateCategories();
  
  // Clear input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  
  // Refresh displayed quote based on current filter
  filterQuotes();
  
  // Trigger sync after add
  await pushLocalQuotes([{ text: quoteText, category: quoteCategory }]);
}

// Function to export quotes to a JSON file
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      // Validate that importedQuotes is an array of valid quote objects
      if (!Array.isArray(importedQuotes) || !importedQuotes.every(q => q.text && q.category)) {
        alert('Invalid JSON format. Please upload a valid quotes file.');
        return;
      }
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories(); // Update categories after import
      filterQuotes(); // Refresh display based on current filter
      // Trigger sync after import
  // Add event listener for the "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', filterQuotes);
  
  // Set the dropdown to the last selected category
  document.getElementById('categoryFilter').value = loadSelectedCategory();
  
  // Initial sync
  const lastQuote = loadLastQuote();
  const selectedCategory = loadSelectedCategory();
  if (lastQuote && (selectedCategory === 'all' || lastQuote.category === selectedCategory)) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';
    const quoteText = document.createElement('p');
    quoteText.textContent = `"${lastQuote.text}"`;
    quoteText.style.fontStyle = 'italic';
    const quoteCategory = document.createElement('p');
    quoteCategory.textContent = `— ${lastQuote.category}`;
    quoteCategory.style.fontWeight = 'bold';
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
  } else {
    filterQuotes();
  }
});  syncData();
  
  // Display the last viewed quote (if available and matches filter) or a filtered quote
  // Populate categories in the dropdown
  populateCategories();
  
      pushLocalQuotes(importedQuotes);
  createAddQuoteForm();
  
  loadQuotes();
  
  // Create the form and import/export controls dynamically
      alert('Quotes imported successfully!');
    } catch (e) {
  // Load quotes from local storage
      alert('Error importing quotes. Please ensure the file is valid JSON.');
    }
document.addEventListener('DOMContentLoaded', () => {
  };
  fileReader.readAsText(event.target.files[0]);
}
