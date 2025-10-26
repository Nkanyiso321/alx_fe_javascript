// Step 1: Quotes array
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "The best revenge is massive success.", category: "Success" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

// Step 2: Display random quote function
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Clear display
  quoteDisplay.innerHTML = "";

  // Create elements dynamically
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  const quoteCategory = document.createElement("p");
  quoteCategory.textContent = `— ${quote.category}`;
  quoteCategory.classList.add("category");

  // Append to DOM
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Step 3: Function to dynamically create add-quote form
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const inputQuote = document.createElement("input");
  inputQuote.id = "newQuoteText";
  inputQuote.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(inputQuote);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Step 4: Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  alert("Quote added successfully!");
}

// Step 5: Add event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

// Step 6: Initialize
displayRandomQuote();
createAddQuoteForm();
