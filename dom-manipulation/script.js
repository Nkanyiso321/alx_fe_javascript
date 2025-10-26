// Step 1: Create an array of quotes with text and category
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "The best revenge is massive success.", category: "Success" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

// Step 2: Function to display a random quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  
  if (!quoteDisplay) return;

  // Select a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Clear and rebuild DOM content
  quoteDisplay.innerHTML = "";

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  const quoteCategory = document.createElement("p");
  quoteCategory.textContent = `— ${quote.category}`;
  quoteCategory.classList.add("category");

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Step 3: Function to create Add Quote form dynamically
function createAddQuoteForm() {
  const container = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  container.appendChild(quoteInput);
  container.appendChild(categoryInput);
  container.appendChild(addButton);

  document.body.appendChild(container);
}

// Step 4: Function to add a new quote to the array and update DOM
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add new quote
  quotes.push({ text, category });

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";

  // Optional: Show confirmation
  alert("Quote added successfully!");
}

// Step 5: Add event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

// Step 6: Initialize on page load
createAddQuoteForm();
displayRandomQuote();
