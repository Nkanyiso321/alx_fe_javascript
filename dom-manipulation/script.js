// Step 1: Initialize quotes array
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "The best revenge is massive success.", category: "Success" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

// Step 2: DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categorySelect = document.getElementById("categorySelect");

// Step 3: Display a random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes found in this category.</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  // Clear and re-create elements dynamically
  quoteDisplay.innerHTML = "";
  const quoteText = document.createElement("p");
  const quoteCategory = document.createElement("p");
  
  quoteText.textContent = `"${quote.text}"`;
  quoteText.style.fontSize = "1.2em";
  
  quoteCategory.textContent = `— ${quote.category}`;
  quoteCategory.classList.add("category");

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Step 4: Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add new quote to array
  quotes.push({ text, category });

  // Dynamically update categories dropdown
  if (![...categorySelect.options].some(opt => opt.value === category.toLowerCase())) {
    const newOption = document.createElement("option");
    newOption.value = category.toLowerCase();
    newOption.textContent = category;
    categorySelect.appendChild(newOption);
  }

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

// Step 5: Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Step 6: Initialize first quote and categories
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.toLowerCase();
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Initialize on load
populateCategories();
showRandomQuote();
