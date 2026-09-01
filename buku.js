// ===================================================
// DATABASE BUKU UTAMA (PERMANEN DI GITHUB)
// ===================================================
const daftarBuku = [
  {
    judul: "Boune City",
    file: "books/boune-city.pdf",
    cover: "img/boune-city-cover.png",
    genre: ["city", "action", "mystery", "crime"],
    deskripsi: "Lima tahun setelah kasus misterius berlalu, Jagad kembali ke Damn Boune dan menemukan petunjuk baru tentang kematian tiga pejabat serta korupsi yang tersembunyi. Bersama Arken, Cendy, dan Akbar, ia berusaha mengungkap dalang di balik semuanya sebelum kebenaran kembali terkubur.",
    tanggal: "1 Sep 2026",
    isPopuler: true
  }
];

let currentFilter = 'all';

// ===================================================
// KONTROL TAMPILAN & FILTER
// ===================================================
function updateFilterButtons() {
  const container = document.getElementById('filterContainer');
  if (!container) return;

  let allGenres = new Set();
  daftarBuku.forEach(buku => {
    if (Array.isArray(buku.genre)) {
      buku.genre.forEach(g => allGenres.add(g.toLowerCase().trim()));
    }
  });

  let html = `<button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" onclick="filterGenre('all')">Semua</button>`;
  allGenres.forEach(genre => {
    html += `<button class="filter-btn ${currentFilter === genre ? 'active' : ''}" onclick="filterGenre('${genre}')">${genre}</button>`;
  });
  
  container.innerHTML = html;
}

function renderBuku(bukuList) {
  const grid = document.getElementById('bookGrid');
  if (!grid) return;
  
  grid.innerHTML = "";

  if (bukuList.length === 0) {
    grid.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px; grid-column:1/-1;">Buku tidak ditemukan...</p>`;
    return;
  }

  bukuList.forEach((buku) => {
    const badges = (buku.genre || []).map(g => `<span class="badge">${g}</span>`).join('');
    const imgCover = buku.cover || 'img/boune-city-cover.png';
    const synopsis = buku.deskripsi || 'Tidak ada sinopsis.';
    const dateStr = buku.tanggal || '1 Sep 2026';
    const popularBadge = buku.isPopuler ? `<div class="badge-popular">⭐ Populer</div>` : '';

    const card = `
      <div class="book-card">
        <div class="cover-wrapper">
          ${popularBadge}
          <img src="${imgCover}" alt="${buku.judul}" onerror="this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop'">
        </div>
        
        <div class="book-details">
          <div>
            <h3 class="book-title">${buku.judul}</h3>
            <p class="book-synopsis">${synopsis}</p>
            
            <div class="book-meta">
              <div class="genre-badges">${badges}</div>
              <div class="upload-date">
                <i class="fa-regular fa-calendar-days"></i> Uploaded: ${dateStr}
              </div>
            </div>
          </div>
          
          <div class="book-action">
            <div class="_df_button btn-read-flip" source="${buku.file}">Baca Flipbook</div>
          </div>
        </div>
      </div>
    `;
    grid.innerHTML += card;
  });

  updateFilterButtons();
}

function filterGenre(genre) {
  currentFilter = genre;
  if (genre === 'all') {
    renderBuku(daftarBuku);
  } else {
    const filtered = daftarBuku.filter(b => 
      Array.isArray(b.genre) && b.genre.map(g => g.toLowerCase()).includes(genre)
    );
    renderBuku(filtered);
  }
}

function searchBuku() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = daftarBuku.filter(b => 
    b.judul.toLowerCase().includes(q) || 
    (Array.isArray(b.genre) && b.genre.some(g => g.toLowerCase().includes(q)))
  );
  renderBuku(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  renderBuku(daftarBuku);
});
