class TrieNode {
    constructor() {
      this.children = {};
      this.isEndOfWord = false;
    }
  }
  
  class Trie {
    constructor() {
      this.root = new TrieNode();
    }
  
    insert(word) {
      let node = this.root;
      for (let char of word.toLowerCase()) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      node.isEndOfWord = true;
    }
  
    search(word) {
      let node = this.root;
      for (let char of word.toLowerCase()) {
        if (!node.children[char]) return false;
        node = node.children[char];
      }
      return node.isEndOfWord;
    }
  
    delete(word, node = this.root, depth = 0) {
      if (!node) return false;
      if (depth === word.length) {
        if (!node.isEndOfWord) return false;
        node.isEndOfWord = false;
        return Object.keys(node.children).length === 0;
      }
      const char = word[depth];
      if (this.delete(word, node.children[char], depth + 1)) {
        delete node.children[char];
        return !node.isEndOfWord && Object.keys(node.children).length === 0;
      }
      return false;
    }
  
    autocomplete(prefix) {
      let node = this.root;
      for (let char of prefix.toLowerCase()) {
        if (!node.children[char]) return [];
        node = node.children[char];
      }
      let results = [];
      this.collectAllWords(node, prefix.toLowerCase(), results);
      return results;
    }
  
    collectAllWords(node, prefix, results) {
      if (node.isEndOfWord) results.push(prefix);
      for (let char in node.children) {
        this.collectAllWords(node.children[char], prefix + char, results);
      }
    }
  
    reset() {
      this.root = new TrieNode();
    }
  }
  
  const trie = new Trie();
  
  const fileInput = document.getElementById('fileInput');
  const uploadBtn = document.getElementById('uploadBtn');
  const fileAddResult = document.getElementById('fileAddResult');
  const wordInput = document.getElementById('wordInput');
  const addWordBtn = document.getElementById('addWordBtn');
  const addResult = document.getElementById('addResult');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const deleteWordBtn = document.getElementById('deleteWordBtn');
  const searchResult = document.getElementById('searchResult');
  const autocompleteInput = document.getElementById('autocompleteInput');
  const suggestionsList = document.getElementById('suggestionsList');
  const resetBtn = document.getElementById('resetBtn');
  const resetResult = document.getElementById('resetResult');
  
  uploadBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const words = text.match(/\b\w+\b/g);
      if (words) {
        words.forEach(word => trie.insert(word));
        fileAddResult.innerText = `✅ File uploaded. Total words: ${words.length}`;
      } else {
        fileAddResult.innerText = '⚠️ No words found in file.';
      }
    };
    reader.readAsText(file);
  });
  
  addWordBtn.addEventListener('click', () => {
    const word = wordInput.value.trim();
    if (word) {
      trie.insert(word);
      addResult.innerText = `✅ Word "${word}" added.`;
      wordInput.value = '';
    }
  });
  
  searchBtn.addEventListener('click', () => {
    const word = searchInput.value.trim();
    if (word) {
      const found = trie.search(word);
      searchResult.innerText = found ? `✅ Found` : `❌ Not Found`;
    }
  });
  
  deleteWordBtn.addEventListener('click', () => {
    const word = searchInput.value.trim();
    if (word) {
      const deleted = trie.delete(word);
      searchResult.innerText = deleted ? `🗑️ Word "${word}" deleted.` : `⚠️ Word not found.`;
    }
  });
  
  autocompleteInput.addEventListener('input', () => {
    const prefix = autocompleteInput.value.trim();
    suggestionsList.innerHTML = '';
    if (prefix) {
      const suggestions = trie.autocomplete(prefix);
      suggestions.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        suggestionsList.appendChild(li);
      });
    }
  });
  
  resetBtn.addEventListener('click', () => {
    trie.reset();
    resetResult.innerText = '🔄 Trie has been reset.';
    fileAddResult.innerText = '';
    addResult.innerText = '';
    searchResult.innerText = '';
    suggestionsList.innerHTML = '';
  });