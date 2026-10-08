import { useState } from "react";
import "./App.css";
import booksData from "./data/books";

const allGenres = [...new Set(booksData.map(b => b.genre))];

function App() {
  const [favorites, setFavorites] = useState(new Set());
  const [selectedGenre, setSelectedGenre] = useState("");

  const filteredBooks = selectedGenre === ""
    ? booksData
    : booksData.filter(b => b.genre === selectedGenre);

  function toggleFav(id) {
    const newFav = new Set(favorites);
    if (newFav.has(id)) {
      newFav.delete(id);
    } else {
      newFav.add(id);
    }
    setFavorites(newFav);
  }

  return (
    <div>
      <header>
        <h1>Thư Viện Lớp</h1>
        <span>Yêu thích: {favorites.size}</span>
      </header>

      <section style={{ padding: "0 20px" }}>
        <div className="genre-filter">
          <button 
            className={selectedGenre === "" ? "active" : ""}
            onClick={() => setSelectedGenre("")}
          >
            Tất cả
          </button>
          
          {allGenres.map(genre => (
            <button
              key={genre}
              className={selectedGenre === genre ? "active" : ""}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 20px" }}>
        <h2 style={{ fontSize: "16px", margin: "10px 0 4px" }}>
          Hiển thị {filteredBooks.length} / {booksData.length} cuốn
        </h2>
        
        {filteredBooks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", padding: "20px" }}>Không có sách.</p>
        ) : (
          <div className="book-grid">
            {filteredBooks.map(book => (
              <article key={book.id} className="book-card">
                <h3>{book.title}</h3>
                <p>Tác giả: {book.author}</p>
                <p>Năm XB: {book.year}</p>
                <span className="genre-badge">{book.genre}</span>
                
                <button
                  className={"btn-fav" + (favorites.has(book.id) ? " active" : "")}
                  onClick={() => toggleFav(book.id)}
                >
                  {favorites.has(book.id) ? "Bỏ yêu thích" : "Yêu thích"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer>
        © {new Date().getFullYear()} Thư Viện Lớp
      </footer>
    </div>
  );
}

export default App;
