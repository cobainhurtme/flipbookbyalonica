// Database Buku
const koleksiBuku = [
    {
        judul: "Boune City",
        file: "books/boune-city.pdf", // Cukup panggil file PDF-nya saja!
        genre: ["kota", "edukasi"],
        deskripsi: "Dokumen dan panduan interaktif seputar kota Boune City."
    }
    // Jika mau nambah buku baru di kemudian hari, tinggal duplikat blok di atas!
];

// Inisialisasi DFlip Global Setting
var dFlipLocation = "https://cdn.jsdelivr.net/npm/dflip/";

// Fungsi Render Buku ke Grid
function renderBuku(bukuList) {
    const grid = document.getElementById('bookGrid');
    grid.innerHTML = "";

    if (bukuList.length === 0) {
        grid.innerHTML = `<p style="text-align:center; grid-column: 1/-1; color: var(--text-muted);">Buku tidak ditemukan...</p>`;
        return;
    }

    bukuList.forEach((buku, index) => {
        const genres = buku.genre.map(g => `<span class="badge-genre">${g}</span>`).join('');
        
        const cardHtml = `
            <div class="book-card">
                <!-- Area ini otomatis merender halaman 1 PDF jadi thumbnail cover -->
                <div class="pdf-thumb-wrapper">
                    <div class="_df_thumb" id="df_thumb_${index}" source="${buku.file}"></div>
                </div>
                <div class="book-info">
                    <div>
                        <div class="book-meta">${genres}</div>
                        <h2 class="book-title">${buku.judul}</h2>
                        <p class="book-desc">${buku.deskripsi}</p>
                    </div>
                    <div class="book-action">
                        <div class="_df_button" source="${buku.file}">Baca Flipbook</div>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += cardHtml;
    });
}

// Fitur Pencarian (Search)
function searchBuku() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = koleksiBuku.filter(buku => {
        return buku.judul.toLowerCase().includes(query) || 
               buku.genre.some(g => g.toLowerCase().includes(query));
    });
    renderBuku(filtered);
}

// Fitur Filter Genre
function filterGenre(genre, btnElement) {
    // Ubah status tombol aktif
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    if (genre === 'all') {
        renderBuku(koleksiBuku);
    } else {
        const filtered = koleksiBuku.filter(buku => buku.genre.includes(genre));
        renderBuku(filtered);
    }
}

// Jalankan Tampilan Awal
renderBuku(koleksiBuku);
