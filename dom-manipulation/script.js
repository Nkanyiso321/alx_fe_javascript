// Initial array of quote objects
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "The journey of a thousand miles begins with a single step.", category: "Inspiration" }
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  // Clear previous content
  quoteDisplay.innerHTML = '';
  
  // Select a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
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
}

// Function to create and append the add quote form
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(formContainer);
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();
  
  // Validate inputs
  if (quoteText === '' || quoteCategory === '') {
    alert('Please enter both a quote and a category.');
    return;
  }
  
  // Add new quote to the quotes array
  quotes.push({ text: quoteText, category: quoteCategory });
  
  // Clear input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  
  // Display the newly added quote
  showRandomQuote();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Create the form dynamically
  createAddQuoteForm();
  
  // Add event listener for the "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Display an initial random quote
  showRandomQuote();
});
