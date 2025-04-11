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
      for (let char of word) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      node.isEndOfWord = true;
    }
  
    search(word) {
      let node = this.root;
      for (let char of word) {
        if (!node.children[char]) return false;
        node = node.children[char];
      }
      return node.isEndOfWord;
    }
  
    delete(word) {
      const deleteHelper = (node, word, depth) => {
        if (!node) return false;
  
        if (depth === word.length) {
          if (!node.isEndOfWord) return false;
          node.isEndOfWord = false;
          return Object.keys(node.children).length === 0;
        }
  
        const char = word[depth];
        if (!node.children[char]) return false;
  
        const shouldDelete = deleteHelper(node.children[char], word, depth + 1);
  
        if (shouldDelete) {
          delete node.children[char];
          return Object.keys(node.children).length === 0 && !node.isEndOfWord;
        }
  
        return false;
      };
  
      return deleteHelper(this.root, word, 0);
    }
  
    visualize(node = this.root, depth = 0) {
      let result = "";
      for (let char in node.children) {
        result += "  ".repeat(depth) + "|-- " + char + (node.children[char].isEndOfWord ? " (end)" : "") + "\n";
        result += this.visualize(node.children[char], depth + 1);
      }
      return result;
    }
  
    getSuggestions(prefix) {
      let node = this.root;
      for (let char of prefix) {
        if (!node.children[char]) return [];
        node = node.children[char];
      }
  
      const results = [];
      const dfs = (node, path) => {
        if (node.isEndOfWord) results.push(path);
        for (let char in node.children) {
          dfs(node.children[char], path + char);
        }
      };
  
      dfs(node, prefix);
      return results;
    }
  
    reset() {
      this.root = new TrieNode();
    }
  }
  
  const trie = new Trie();
  
  function insertWord() {
    const word = document.getElementById("wordInput").value.trim().toLowerCase();
    if (!word) return log("Please enter a word.");
    trie.insert(word);
    log(`✅ Inserted "${word}"`);
    addToHistory(`Inserted "${word}"`);
    updateVisualization();
    clearInput();
  }
  
  function searchWord() {
    const word = document.getElementById("wordInput").value.trim().toLowerCase();
    if (!word) return log("Please enter a word.");
    const found = trie.search(word);
    if (found) {
      log(`🔍 Word "${word}" found`);
      addToHistory(`Searched "${word}" → ✅ Found`);
    } else {
      log(`❌ Word "${word}" not found`);
      addToHistory(`Searched "${word}" → ❌ Not Found`);
    }
    clearInput();
  }
  
  function deleteWord() {
    const word = document.getElementById("wordInput").value.trim().toLowerCase();
    if (!word) return log("Please enter a word.");
    const deleted = trie.delete(word);
    if (deleted) {
      log(`🗑️ Deleted "${word}"`);
      addToHistory(`Deleted "${word}"`);
    } else {
      log(`⚠️ "${word}" not found or not deletable`);
      addToHistory(`Tried deleting "${word}" → Not Found`);
    }
    updateVisualization();
    clearInput();
  }
  
  function updateVisualization() {
    const root = trie.root;
    const isEmpty = Object.keys(root.children).length === 0;
    const output = isEmpty ? "(empty)" : trie.visualize();
    document.getElementById("visualization").textContent = output;
  }
  
  function log(msg) {
    document.getElementById("log").textContent = msg;
  }
  
  function addToHistory(entry) {
    const historyList = document.getElementById("history");
    const item = document.createElement("li");
    item.textContent = entry;
    historyList.prepend(item);
  }
  
  function clearInput() {
    document.getElementById("wordInput").value = "";
    document.getElementById("suggestions").innerHTML = "";
  }
  
  function showSuggestions() {
    const input = document.getElementById("wordInput").value.trim().toLowerCase();
    const suggestionsList = document.getElementById("suggestions");
    suggestionsList.innerHTML = "";
  
    if (input === "") return;
  
    const suggestions = trie.getSuggestions(input);
    suggestions.forEach(word => {
      const li = document.createElement("li");
      li.textContent = word;
      li.onclick = () => {
        document.getElementById("wordInput").value = word;
        suggestionsList.innerHTML = "";
      };
      suggestionsList.appendChild(li);
    });
  }
  
  updateVisualization();
  