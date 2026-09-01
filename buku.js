// ==========================================
// 1. DATABASE BUKU PERMANEN (CLOUD GITHUB)
// ==========================================
// Setiap ada buku baru, edit/tambah di dalam array ini:
const defaultBuku = [
  {
    judul: "Boune City",
    file: "books/boune-city.pdf",
    cover: "img/boune-city-cover.png",
    genre: ["kota", "edukasi"],
    deskripsi: "Dokumen dan panduan interaktif seputar kota Boune City. Temukan informasi lengkap mengenai sejarah, fasilitas, dan rencana masa depan kota.",
    tanggal: "1 Sep 2026",
    isPopuler: true
  }
  /*
  // TEMPLATE BUAT NAMBAH BUKU BARU (Hapus tanda komentar /* di atas dan bawah jika ingin digunakan):
  ,{
    judul: "Judul Buku Baru",
    file: "books/nama-file.pdf",
    cover: "img/nama-cover.png",
    genre: ["komik", "hiburan"], // Genre/Kategori baru otomatis jadi tombol filter
    deskripsi: "Tuliskan sinopsis singkat buku di sini...",
    tanggal: "2 Sep 2026",
    isPopuler: false
  }
  */
];

// Load data dari LocalStorage jika ada, atau gunakan defaultBuku
let koleksiBuku = JSON.parse(localStorage.getItem('alonica_v5')) || defaultBuku;
let currentFilter = 'all';

// ==========================================
// 2. FUNGSI OTOMASI FILTER GENRE / KATEGORI
// ==========================================
function updateFilterButtons() {
  const container = document.getElementById('filterContainer');
  if (!container) return;

  let allGenres = new Set();
  koleksiBuku.forEach(buku => {
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

// ==========================================
// 3. FUNGSI RENDER KATALOG BUKU KE LAYAR
// ==========================================
function renderBuku(bukuList) {
  const grid = document.getElementById('bookGrid');
  if (!grid) return;
  
  grid.innerHTML = "";

  if (bukuList.length === 0) {
    grid.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px; grid-column:1/-1;">Buku tidak ditemukan...</p>`;
    return;
  }

  bukuList.forEach((buku) => {
    // Cari indeks asli di array koleksiBuku
    const realIndex = koleksiBuku.findIndex(b => b.judul === buku.judul && b.file === buku.file);
    
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
          
          <div class="book-action-bar">
            <div class="book-action">
              <div class="_df_button btn-read-flip" source="${buku.file}">Baca Flipbook</div>
            </div>
            <div class="card-tools">
              <button class="btn-tool edit" title="Edit Buku" onclick="openEditModal(${realIndex})"><i class="fa-solid fa-pen"></i></button>
              <button class="btn-tool delete" title="Hapus Buku" onclick="deleteBook(${realIndex})"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        </div>
      </div>
    `;
    grid.innerHTML += card;
  });

  updateFilterButtons();
}

// ==========================================
// 4. KONTROL MODAL FORM (TAMBAH & EDIT)
// ==========================================
function openAddModal() {
  document.getElementById('editIndex').value = "-1";
  document.getElementById('modalTitle').innerHTML = `<i class="fa-solid fa-plus-circle"></i> Tambah Buku Baru`;
  document.getElementById('bookForm').reset();
  document.getElementById('bookModal').style.display = 'flex';
}

function openEditModal(index) {
  const b = koleksiBuku[index];
  document.getElementById('editIndex').value = index;
  document.getElementById('modalTitle').innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Buku`;
  
  document.getElementById('inputJudul').value = b.judul;
  document.getElementById('inputFile').value = b.file;
  document.getElementById('inputCover').value = b.cover;
  document.getElementById('inputGenre').value = Array.isArray(b.genre) ? b.genre.join(', ') : b.genre;
  document.getElementById('inputDesc').value = b.deskripsi;
  document.getElementById('inputPopuler').checked = !!b.isPopuler;

  document.getElementById('bookModal').style.display = 'flex';
}

function closeModal() { 
  document.getElementById('bookModal').style.display = 'none'; 
}

// ==========================================
// 5. SIMPAN, EDIT & HAPUS BUKU
// ==========================================
function handleFormSubmit(e) {
  e.preventDefault();
  const index = parseInt(document.getElementById('editIndex').value);
  const judul = document.getElementById('inputJudul').value;
  const file = document.getElementById('inputFile').value;
  const cover = document.getElementById('inputCover').value || 'img/boune-city-cover.png';
  const genreRaw = document.getElementById('inputGenre').value;
  const deskripsi = document.getElementById('inputDesc').value;
  const isPopuler = document.getElementById('inputPopuler').checked;

  const genres = genreRaw ? genreRaw.split(',').map(g => g.trim().toLowerCase()) : ['umum'];

  if (index === -1) {
    // Tambah Baru
    const now = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const tanggal = now.toLocaleDateString('id-ID', options);
    
    koleksiBuku.push({ judul, file, cover, genre: genres, deskripsi, tanggal, isPopuler });
  } else {
    // Edit yang Ada
    koleksiBuku[index].judul = judul;
    koleksiBuku[index].file = file;
    koleksiBuku[index].cover = cover;
    koleksiBuku[index].genre = genres;
    koleksiBuku[index].deskripsi = deskripsi;
    koleksiBuku[index].isPopuler = isPopuler;
  }

  localStorage.setItem('alonica_v5', JSON.stringify(koleksiBuku));
  renderBuku(koleksiBuku);
  closeModal();
}

function deleteBook(index) {
  if (confirm(`Apakah kamu yakin ingin menghapus buku "${koleksiBuku[index].judul}"?`)) {
    koleksiBuku.splice(index, 1);
    localStorage.setItem('alonica_v5', JSON.stringify(koleksiBuku));
    renderBuku(koleksiBuku);
  }
}

// ==========================================
// 6. FITUR FILTER & PENCARIAN (SEARCH)
// ==========================================
function filterGenre(genre) {
  currentFilter = genre;
  if (genre === 'all') {
    renderBuku(koleksiBuku);
  } else {
    const filtered = koleksiBuku.filter(b => 
      Array.isArray(b.genre) && b.genre.map(g => g.toLowerCase()).includes(genre)
    );
    renderBuku(filtered);
  }
}

function searchBuku() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = koleksiBuku.filter(b => 
    b.judul.toLowerCase().includes(q) || 
    (Array.isArray(b.genre) && b.genre.some(g => g.toLowerCase().includes(q)))
  );
  renderBuku(filtered);
}

// Jalankan rendering awal saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  renderBuku(koleksiBuku);
});
