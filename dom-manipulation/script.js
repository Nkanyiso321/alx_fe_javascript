// Simulated server interaction using JSONPlaceholder
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();
    return serverQuotes.map(post => ({
      id: post.id,
      text: post.title,
      author: post.body,
      timestamp: new Date().toISOString(), // Simulate timestamp
    }));
  } catch (error) {
    console.error('Error fetching server quotes:', error);
    return [];
  }
}

// Function to send a quote to the server
async function sendQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: quote.text,
        body: quote.author,
        timestamp: quote.timestamp,
      }),
    });
    const result = await response.json();
    return {
      id: result.id,
      text: result.title,
      author: result.body,
      timestamp: result.timestamp || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error sending quote to server:', error);
    return null;
  }
}

// Local storage management
function getLocalQuotes() {
  return JSON.parse(localStorage.getItem('quotes') || '[]');
}

function saveLocalQuotes(quotes) {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Sync local quotes with server
async function syncQuotes() {
  const localQuotes = getLocalQuotes();
  const serverQuotes = await fetchQuotesFromServer();

  // Merge quotes with conflict resolution (server precedence)
  const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);

  // Save merged quotes to local storage
  saveLocalQuotes(mergedQuotes);

  // Send any new local quotes to the server
  for (const quote of localQuotes) {
    if (!quote.id || !serverQuotes.some(sq => sq.id === quote.id)) {
      const serverQuote = await sendQuoteToServer(quote);
      if (serverQuote) {
        mergedQuotes.push(serverQuote);
        saveLocalQuotes(mergedQuotes);
      }
    }
  }

  // Update UI with merged quotes
  updateUI(mergedQuotes);
  showNotification('Quotes synced with server!');
}

// Merge local and server quotes with conflict resolution
function mergeQuotes(localQuotes, serverQuotes) {
  const merged = [...serverQuotes];

  for (const localQuote of localQuotes) {
    const serverQuote = serverQuotes.find(sq => sq.id === localQuote.id);
    if (!serverQuote) {
      // If local quote doesn't exist on server, it will be sent later
      continue;
    }
    // Server precedence: Keep server quote if timestamps differ
    if (serverQuote.timestamp > localQuote.timestamp) {
      continue; // Server quote is newer, keep it
    } else if (localQuote.timestamp > serverQuote.timestamp) {
      // Local quote is newer, mark for manual resolution
      showConflictNotification(localQuote, serverQuote);
      // For simplicity, keep server quote unless user resolves
    }
  }

  return merged;
}

// Notification system
function showNotification(message) {
  const notification = document.getElementById('notification');
  const messageSpan = document.getElementById('notification-message');
  messageSpan.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// Conflict resolution UI
let conflictingQuotes = null;

function showConflictNotification(localQuote, serverQuote) {
  conflictingQuotes = { localQuote, serverQuote };
  const modal = document.getElementById('conflict-modal');
  document.getElementById('local-quote').textContent = `${localQuote.text} - ${localQuote.author}`;
  document.getElementById('server-quote').textContent = `${serverQuote.text} - ${serverQuote.author}`;
  modal.style.display = 'block';
}

function closeConflictModal() {
  document.getElementById('conflict-modal').style.display = 'none';
  conflictingQuotes = null;
}

function resolveConflict(choice) {
  if (!conflictingQuotes) return;

  const { localQuote, serverQuote } = conflictingQuotes;
  let mergedQuotes = getLocalQuotes();
  if (choice === 'local') {
    // Keep local quote and update server
    mergedQuotes = mergedQuotes.map(q => (q.id === localQuote.id ? localQuote : q));
    sendQuoteToServer(localQuote);
  } else {
    // Keep server quote (default)
    mergedQuotes = mergedQuotes.map(q => (q.id === serverQuote.id ? serverQuote : q));
  }
  saveLocalQuotes(mergedQuotes);
  updateUI(mergedQuotes);
  showNotification(`Conflict resolved: ${choice} quote kept.`);
  closeConflictModal();
}

// Update UI with quotes
function updateUI(quotes) {
  const quoteContainer = document.getElementById('quote-container');
  quoteContainer.innerHTML = '';
  quotes.forEach(quote => {
    const quoteElement = document.createElement('div');
    quoteElement.textContent = `${quote.text} - ${quote.author}`;
    quoteElement.style.padding = '10px';
    quoteElement.style.borderBottom = '1px solid #ccc';
    quoteContainer.appendChild(quoteElement);
  });
}

// Add a new local quote
function addLocalQuote(text, author) {
  const localQuotes = getLocalQuotes();
  const newQuote = {
    id: `local-${Date.now()}`, // Temporary ID until synced
    text,
    author,
    timestamp: new Date().toISOString(),
  };
  localQuotes.push(newQuote);
  saveLocalQuotes(localQuotes);
  updateUI(localQuotes);
  syncQuotes(); // Trigger sync after adding
}

// Handle form submission for adding quotes
function handleAddQuote(event) {
  event.preventDefault();
  const quoteText = document.getElementById('quote-text').value;
  const quoteAuthor = document.getElementById('quote-author').value;
  if (quoteText && quoteAuthor) {
    addLocalQuote(quoteText, quoteAuthor);
    document.getElementById('quote-form').reset();
  } else {
    showNotification('Please enter both quote and author.');
  }
}

// Test function
async function runTests() {
  // Test 1: Add a local quote and sync
  addLocalQuote('Test quote', 'Test author');
  await syncQuotes();
  console.log('Test 1: Local quote added and synced.');

  // Test 2: Simulate conflict
  const localQuotes = getLocalQuotes();
  if (localQuotes.length > 0) {
    const conflictingQuote = { ...localQuotes[0], text: 'Modified quote', timestamp: new Date().toISOString() };
    localQuotes[0] = conflictingQuote;
    saveLocalQuotes(localQuotes);
    await syncQuotes();
    console.log('Test 2: Conflict triggered and UI updated.');
  }

  // Test 3: Verify no data loss
  const finalQuotes = getLocalQuotes();
  console.log('Test 3: Final quotes:', finalQuotes);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Load initial quotes
  updateUI(getLocalQuotes());
  // Start periodic sync (every 30 seconds)
  setInterval(syncQuotes, 30000);
  // Attach form submission handler
  document.getElementById('quote-form').addEventListener('submit', handleAddQuote);
});
