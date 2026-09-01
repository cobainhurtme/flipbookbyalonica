// Database Buku Kita
const koleksiBuku = [
    {
        judul: "Boune City",
        cover: "img/boune-city-cover.jpg", // Jalur gambar cover (wajib dibuat)
        file: "books/boune-city.pdf",       // Jalur file PDF kamu
        genre: ["kota", "edukasi"],
        deskripsi: "Dokumen dan panduan interaktif seputar kota Boune City."
    },
    {
        judul: "Edisi Majalah Keren",
        cover: "img/majalah-cover.jpg",    // Jalur gambar cover baru
        file: "books/majalah-baru.pdf",    // Jalur file PDF baru (belum ada)
        genre: ["majalah"],
        deskripsi: "Majalah digital mingguan edisi terbaru."
    }
    // Kalau mau nambah buku, tinggal copy blok di atas dan ganti isinya
];

// Fungsi untuk nampilin semua buku ke Grid
function renderBuku(bukuToShow) {
    const grid = document.getElementById('bookGrid');
    grid.innerHTML = ""; // Bersihkan grid dulu

    bukuToShow.forEach(buku => {
        const genres = buku.genre.map(g => `<span class="badge-genre">${g}</span>`).join('');
        
        const cardHtml = `
            <div class="book-card" data-genre="${buku.genre.join(' ')}" data-judul="${buku.judul.toLowerCase()}">
                <div class="cover-wrapper">
                    <img src="${buku.cover}" alt="Cover ${buku.judul}">
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

// Inisialisasi tampilan awal
renderBuku(koleksiBuku);

// Fungsi Filter Genre (Masih Manual)
function filterGenre(genre) {
    // Implementasi filter menyusul jika dibutuhkan
    alert('Filter ' + genre + ' diklik!');
}
