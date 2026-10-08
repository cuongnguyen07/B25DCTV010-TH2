let allBooks = [];
let favorites = new Set();
let filterName = "";
let filterGenre = "";

async function loadBooks() {
  document.getElementById("status").textContent = "Đang tải...";
  try {
    const response = await fetch("books.json");
    if (!response.ok) throw new Error("Không tải được dữ liệu");

    allBooks = await response.json();

    const genres = new Set(allBooks.map(book => book.genre));
    const select = document.getElementById("genre-select");
    genres.forEach(genre => {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      select.appendChild(option);
    });

    const saved = localStorage.getItem("favorites");
    if (saved) favorites = new Set(JSON.parse(saved));

    render();
  } catch (error) {
    document.getElementById("status").textContent = "Lỗi: " + error.message;
  }
}

function render() {
  const filtered = allBooks.filter(book => {
    const matchName = book.title.toLowerCase().includes(filterName.toLowerCase());
    const matchGenre = filterGenre === "" || book.genre === filterGenre;
    return matchName && matchGenre;
  });

  document.getElementById("status").textContent = 
    `Đang hiển thị ${filtered.length} / ${allBooks.length} cuốn`;

  const list = document.getElementById("book-list");
  list.innerHTML = "";

  if (filtered.length === 0) {
    list.innerHTML = "<p style='text-align:center; color:#888'>Không tìm thấy sách.</p>";
    return;
  }

  filtered.forEach(book => {
    const card = document.createElement("article");
    card.className = "book-card";

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent =  book.author;

    const year = document.createElement("p");
    year.textContent =  book.year;

    const genre = document.createElement("span");
    genre.className = "genre";
    genre.textContent = book.genre;

    const btnFav = document.createElement("button");
    btnFav.className = "btn-fav" + (favorites.has(book.id) ? " active" : "");
    btnFav.textContent = favorites.has(book.id) ? "❤️ Bỏ thích" : "🤍 Yêu thích";
    btnFav.dataset.id = book.id;

    const btnDel = document.createElement("button");
    btnDel.className = "btn-del";
    btnDel.textContent = "🗑️ Xoá";
    btnDel.dataset.id = book.id;

    const actions = document.createElement("div");
    actions.className = "actions";
    actions.appendChild(btnFav);
    actions.appendChild(btnDel);

    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(year);
    card.appendChild(genre);
    card.appendChild(actions);

    list.appendChild(card);
  });

  document.getElementById("fav-count").textContent = favorites.size;
}

document.getElementById("book-list").addEventListener("click", function(event) {
  const btn = event.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;

  if (btn.classList.contains("btn-fav")) {
    if (favorites.has(id)) {
      favorites.delete(id);
    } else {
      favorites.add(id);
    }
    localStorage.setItem("favorites", JSON.stringify([...favorites]));
    render();
  }

  if (btn.classList.contains("btn-del")) {
    const book = allBooks.find(b => b.id === id);
    if (!confirm(`Xoá sách "${book.title}"?`)) return;

    allBooks = allBooks.filter(b => b.id !== id);
    favorites.delete(id);
    localStorage.setItem("favorites", JSON.stringify([...favorites]));
    render();
  }
});

document.getElementById("search-input").addEventListener("input", function() {
  filterName = this.value;
  render();
});

document.getElementById("genre-select").addEventListener("change", function() {
  filterGenre = this.value;
  render();
});

function toggleForm() {
  const form = document.getElementById("add-form");
  form.style.display = form.style.display === "block" ? "none" : "block";
}

function validateTitle() {
  const input = document.getElementById("inp-title");
  const err = document.getElementById("err-title");
  if (input.value.trim().length < 3) {
    err.textContent = "Tên sách phải ít nhất 3 ký tự.";
    input.classList.add("invalid");
    return false;
  }
  err.textContent = "";
  input.classList.remove("invalid");
  return true;
}

function validateAuthor() {
  const input = document.getElementById("inp-author");
  const err = document.getElementById("err-author");
  if (input.value.trim() === "") {
    err.textContent = "Tác giả không được để trống.";
    input.classList.add("invalid");
    return false;
  }
  err.textContent = "";
  input.classList.remove("invalid");
  return true;
}

function validateGenre() {
  const input = document.getElementById("inp-genre");
  const err = document.getElementById("err-genre");
  if (input.value === "") {
    err.textContent = "Vui lòng chọn thể loại.";
    return false;
  }
  err.textContent = "";
  return true;
}

function validateYear() {
  const input = document.getElementById("inp-year");
  const err = document.getElementById("err-year");
  const year = Number(input.value);
  const now = new Date().getFullYear();
  if (!input.value || year < 1900 || year > now) {
    err.textContent = `Năm phải từ 1900 đến ${now}.`;
    input.classList.add("invalid");
    return false;
  }
  err.textContent = "";
  input.classList.remove("invalid");
  return true;
}

function submitForm(event) {
  event.preventDefault();

  const ok = validateTitle() & validateAuthor() & validateGenre() & validateYear();
  if (!ok) return;

  const newBook = {
    id: String(Date.now()),
    title: document.getElementById("inp-title").value.trim(),
    author: document.getElementById("inp-author").value.trim(),
    genre: document.getElementById("inp-genre").value,
    year: Number(document.getElementById("inp-year").value),
  };

  allBooks.unshift(newBook);
  
  document.getElementById("add-form").reset();
  document.getElementById("add-form").style.display = "none";

  render();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("theme-btn");
  btn.textContent = document.body.classList.contains("dark");
}

loadBooks();
