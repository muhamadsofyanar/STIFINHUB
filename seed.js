const themes = [
  ['Dasar STIFIn','Memahami Tes STIFIn Tanpa Menjadikannya Vonis','Tes STIFIn digunakan sebagai alat bantu untuk mengenali kecenderungan cara kerja dan pola respons. Hasilnya perlu dibaca secara utuh dalam sesi penjelasan, bukan dijadikan label untuk membatasi pilihan hidup.','Calon peserta','WSL 1 dan STIFIn Personality 1.0'],
  ['Mengenali Diri','Mengapa Kita Sering Lelah Menjadi Orang Lain','Banyak orang memaksakan strategi yang cocok bagi orang lain. Pengenalan pola diri membantu seseorang memilih cara belajar, bekerja, dan berkomunikasi yang lebih realistis.','Dewasa muda','WSL 1'],
  ['Parenting','Anak Sulit Diatur atau Belum Dipahami','Perilaku anak perlu dibaca dari kebutuhan, tahap perkembangan, situasi keluarga, dan kecenderungan personalnya. Orang tua dapat menyesuaikan cara memberi instruksi tanpa mengurangi batas dan tanggung jawab.','Orang tua','Workbook STIFIn Parenting'],
  ['Belajar','Cara Belajar yang Bisa Dievaluasi','Strategi belajar yang efektif perlu cocok dengan cara anak menangkap, mengolah, dan mengulang informasi. Orang tua dan guru tetap perlu mengukur hasilnya lewat kebiasaan dan capaian belajar.','Pelajar dan orang tua','Workbook STIFIn Learning dan Teaching'],
  ['Pasangan','Berbeda Cara Berpikir Bukan Berarti Tidak Cocok','Konflik pasangan sering muncul karena perbedaan cara merespons masalah, mengungkap perhatian, dan mengambil keputusan. Pemetaan pola dapat membuka dialog yang lebih spesifik.','Pasangan menikah','Workbook STIFIn Couple'],
  ['Profesi','Memilih Profesi Tanpa Terjebak Label','Hasil tes tidak menentukan satu pekerjaan wajib. Ia dapat dipakai untuk membahas lingkungan kerja, jenis tantangan, cara berkontribusi, dan kompetensi yang tetap perlu dilatih.','Mahasiswa dan pencari kerja','Workbook STIFIn Profesi'],
  ['Bisnis','Menempatkan Orang Sesuai Kontribusi Terbaik','Tim bertumbuh ketika peran, target, dan cara koordinasi jelas. Pengenalan karakter kerja membantu pemimpin mengatur komunikasi dan pembagian tugas, tetapi evaluasi kinerja tetap memakai data.','Pemilik usaha','Workbook STIFIn Bisnis dan Human Resource'],
  ['Kepemimpinan','Memimpin Orang yang Berbeda Tanpa Menurunkan Standar','Pemimpin dapat mempertahankan standar yang sama sambil membedakan cara memberi arahan, umpan balik, dan dukungan kepada anggota tim.','Pemimpin komunitas','Workbook STIFIn Leadership'],
  ['Keuangan','Mengenali Pola Diri dalam Mengelola Uang','Keputusan keuangan dipengaruhi kebiasaan, tujuan, kontrol diri, dan cara menilai risiko. Pengenalan diri membantu menyusun sistem, bukan menggantikan anggaran dan disiplin.','Keluarga muda','Workbook STIFIn Finansial'],
  ['Rezeki','Ikhtiar yang Selaras dengan Kekuatan','Pengenalan kekuatan membantu seseorang menentukan bentuk ikhtiar yang lebih konsisten. Hasil tetap dipengaruhi kompetensi, kesempatan, jaringan, disiplin, dan ketetapan Allah.','Masyarakat umum','Materi STIFIn Rezeki dan PALUGADA'],
  ['Promotor','Menjadi Promotor Dimulai dari Mengalami Tes','Calon promotor perlu menjalani tes, memahami hasilnya, mengikuti WSL 1 dan WSL 2, lalu memenuhi ketentuan aktivasi. Urutan ini menjaga mutu layanan kepada peserta.','Calon promotor','Workbook WSL 1 dan WSL 2'],
  ['WSL 1','Fondasi yang Perlu Dipahami Calon Promotor','WSL 1 membangun fondasi konsep, pengenalan sembilan personaliti genetik, sirkulasi mesin kecerdasan, proses belajar, ujian, dan persiapan menuju WSL 2.','Calon promotor','Workbook STIFIn Level 1'],
  ['WSL 2','Pendalaman Sebelum Aktivasi','WSL 2 memperdalam konsep dan praktik membaca hasil tes. Peserta mengikuti pembelajaran, praktik, serta ujian kompetensi sebelum masuk ke proses aktivasi.','Peserta WSL 1','Workbook STIFIn Level 2'],
  ['Layanan Tes','Apa yang Terjadi Setelah Sidik Jari Dipindai','Nilai utama layanan tidak berhenti pada pemindaian. Peserta memerlukan penjelasan hasil, ruang bertanya, batas penggunaan hasil, dan langkah praktis yang sesuai kebutuhannya.','Calon peserta','SOP Booking dan Test Day'],
  ['Jaringan Wilayah','Tes STIFIn di Luar Kota Tetap Bisa Dibantu','STIFIn Mulia dapat menerima pertanyaan dari berbagai wilayah lalu menghubungkan calon peserta kepada promotor atau cabang yang relevan setelah mendapat persetujuan.','Calon peserta luar kota','Playbook Partner dan Node Lokal'],
];

const angles = [
  ['Pertanyaan Dasar','Awareness','Carousel','Apa yang sebenarnya perlu dipahami tentang {theme}?'],
  ['Kesalahan Umum','Awareness','Reels','Kesalahan yang sering terjadi saat membahas {theme}'],
  ['Cerita Reflektif','Consideration','Image','Ketika seseorang akhirnya memahami {theme}'],
  ['Langkah Praktis','Consideration','Carousel','Lima langkah memulai {theme} secara sehat'],
  ['Mitos dan Fakta','Awareness','Carousel','Mitos dan fakta tentang {theme}'],
  ['Tanya Jawab','Consideration','Video','Pertanyaan yang paling sering muncul tentang {theme}'],
  ['Undangan Konsultasi','Conversion','WhatsApp','Apakah {theme} relevan dengan kebutuhan Anda?'],
  ['Artikel Mendalam','Consideration','Artikel','Panduan lengkap memahami {theme} secara proporsional'],
];

const replace = (text, theme) => text.replaceAll('{theme}', theme.toLowerCase());

export function seedContent() {
  let id = 0;
  return themes.flatMap(([pillar, theme, insight, audience, source]) => angles.map(([category, funnel, format, titleTemplate], angleIndex) => {
    id += 1;
    const title = replace(titleTemplate, theme);
    const hook = angleIndex === 2
      ? `Ada orang yang terdiam, bahkan menangis, ketika penjelasan hasil tes membuat pengalaman hidupnya terasa lebih masuk akal. Mengapa ${theme.toLowerCase()} dapat memicu refleksi sedalam itu?`
      : `Banyak orang mencari jawaban tentang ${theme.toLowerCase()}, tetapi menerima penjelasan yang terlalu singkat atau terlalu menjanjikan.`;
    const caption = `${hook}\n\n${insight}\n\nPembahasan yang bertanggung jawab tidak berhenti pada istilah personaliti. Kita perlu melihat kebutuhan nyata, konteks keluarga atau pekerjaan, kebiasaan yang sudah terbentuk, dan tujuan yang ingin dicapai. Dari sana, hasil tes dapat diterjemahkan menjadi pertanyaan yang lebih jernih dan langkah yang dapat diuji dalam kehidupan sehari-hari.\n\nSTIFIn Mulia menempatkan sesi penjelasan sebagai bagian penting dari layanan. Peserta mendapat ruang untuk bertanya, menghubungkan hasil dengan pengalaman, dan menyusun satu langkah praktis. Hasil tes bukan diagnosis medis, bukan ukuran nilai seseorang, dan bukan janji keberhasilan.\n\nJika Anda sedang memikirkan ${theme.toLowerCase()}, simpan materi ini. Kirim pertanyaan melalui WhatsApp STIFIn Mulia agar kami membantu menentukan langkah berikutnya atau menghubungkan Anda dengan jaringan layanan di wilayah Anda.`;
    return {
      id, code: `SM-${String(id).padStart(3,'0')}`, title, pillar, category, audience, funnel,
      objective: `Membantu ${audience.toLowerCase()} memahami ${theme.toLowerCase()} dan mengambil langkah yang proporsional.`,
      format, channel: format === 'Artikel' ? 'Website' : 'Instagram, Facebook, TikTok, WhatsApp',
      problem: `Pembaca membutuhkan penjelasan yang lebih lengkap tentang ${theme.toLowerCase()} dan belum tahu langkah berikutnya.`,
      hook, core: insight, action: 'Catat satu masalah utama, ajukan pertanyaan, lalu tentukan apakah perlu konsultasi atau tes.',
      caption, carousel: `1. Judul: ${title}\n2. Masalah yang sering dialami\n3. Penjelasan inti\n4. Batas penggunaan hasil tes\n5. Contoh langkah praktis\n6. Pertanyaan refleksi\n7. CTA konsultasi`,
      reels: `Pembuka: ${hook}\nIsi: ${insight}\nPenutup: Kenali pola, uji langkahnya, dan konsultasikan bila perlu.`,
      cta: 'Konsultasikan kebutuhan Anda melalui WhatsApp 081333362649.',
      keyword: `${theme.toLowerCase()}, tes STIFIn, STIFIn Indonesia, STIFIn Mulia`, hashtags: '#STIFInMulia #TesSTIFIn #KenaliDiri #BelajarBertumbuh',
      source, status: 'Belum dibuat', plannedDate: '', owner: 'Tim Konten', designUrl: '', publishedUrl: '', reach: 0, saves: 0, shares: 0, leads: 0,
    };
  }));
}

export function seedTemplates() {
  const rows = [
    ['WA-01','Balasan pertama calon peserta','Membuka percakapan','Assalamu’alaikum. Terima kasih sudah menghubungi STIFIn Mulia. Boleh kami tahu nama, domisili, dan kebutuhan utama yang ingin dibantu?'],
    ['WA-02','Menjelaskan tes','Memberi gambaran proporsional','Tes STIFIn membantu mengenali kecenderungan cara kerja dan pola respons melalui pemindaian sidik jari serta sesi penjelasan. Hasilnya bukan diagnosis medis dan tidak digunakan untuk membatasi pilihan hidup.'],
    ['WA-03','Memastikan domisili','Menentukan layanan','Agar kami dapat membantu dengan tepat, tes direncanakan di kota mana? Jika berada di luar wilayah layanan langsung kami, kami dapat membantu menghubungkan dengan promotor atau cabang terdekat setelah mendapat persetujuan Anda.'],
    ['WA-04','Follow up ringan','Menghidupkan percakapan','Assalamu’alaikum. Saya menindaklanjuti informasi tes STIFIn yang kemarin. Apakah masih ada hal yang ingin ditanyakan sebelum menentukan jadwal?'],
    ['WA-05','Mengajak booking','Mendorong keputusan','Jika penjelasannya sudah cukup, kami dapat membantu mengecek pilihan jadwal tes. Hari kerja atau akhir pekan yang lebih nyaman?'],
    ['WA-06','Pengingat jadwal','Mengurangi ketidakhadiran','Assalamu’alaikum. Kami mengingatkan jadwal tes STIFIn besok. Mohon hadir sesuai waktu yang disepakati dan kabari kami jika ada perubahan.'],
    ['WA-07','Setelah tes','Menjaga pendampingan','Terima kasih sudah mengikuti tes dan sesi penjelasan. Dari pembahasan tadi, langkah kecil apa yang paling ingin dicoba dalam satu minggu ke depan?'],
    ['WA-08','Minat promotor','Kualifikasi awal','Terima kasih atas minat menjadi promotor. Sebelum membahas jalur pelatihan, kami perlu memastikan Anda sudah menjalani tes dan memahami hasilnya. Apakah sudah pernah tes STIFIn?'],
    ['WA-09','Jalur promotor','Menjelaskan tahapan','Jalur promotor dimulai dari tes STIFIn, WSL 1, WSL 2, lalu aktivasi ID dan scanner sesuai ketentuan yang berlaku. Kami akan menjelaskan fungsi, kesiapan, biaya terbaru, dan pendampingan pada setiap tahap.'],
    ['WA-10','Undangan WSL 1','Mengajak ke fondasi','WSL 1 membahas fondasi konsep, sembilan personaliti genetik, sirkulasi mesin kecerdasan, serta persiapan menuju WSL 2. Apakah Anda ingin menerima jadwal kelas terdekat?'],
    ['WA-11','Undangan WSL 2','Mengajak pendalaman','Setelah WSL 1, tahap berikutnya adalah pendalaman materi, praktik membaca hasil, dan ujian kompetensi pada WSL 2. Kami dapat membantu mengecek kesiapan dan jadwalnya.'],
    ['WA-12','Pendampingan promotor','Mengidentifikasi hambatan','Untuk evaluasi pekan ini, berapa prospek yang sudah dihubungi, berapa booking, dan hambatan utama yang paling terasa? Kita pilih satu dukungan yang paling dibutuhkan.'],
    ['WA-13','Minta izin rujukan','Menjaga persetujuan','Di wilayah Anda tersedia jaringan promotor/cabang yang dapat membantu. Apakah Anda bersedia jika nama dan nomor WhatsApp diteruskan kepada pihak tersebut untuk tindak lanjut layanan?'],
    ['WA-14','Serah terima rujukan','Membuat handover jelas','Assalamu’alaikum. Dengan izin calon peserta, kami menghubungkan Bapak/Ibu dengan [nama] dari [kota]. Kebutuhan awalnya adalah [kebutuhan]. Mohon tindak lanjut dan pembaruan status layanan.'],
    ['WA-15','Ajakan kerja sama','Membuka mitra kegiatan','STIFIn Mulia membuka kerja sama kegiatan edukasi dan layanan tes untuk kampus, sekolah, komunitas, serta lembaga. Kami dapat menyesuaikan tema, jumlah peserta, dan bentuk pelaksanaannya.'],
    ['WA-16','Meminta testimoni','Mengumpulkan bukti sosial','Terima kasih sudah mengikuti layanan. Jika berkenan, boleh berbagi pengalaman singkat tentang bagian penjelasan yang paling membantu? Testimoni hanya kami gunakan setelah mendapat izin.'],
  ];
  return rows.map((r,i)=>({id:i+1,code:r[0],situation:r[1],objective:r[2],body:r[3],active:true}));
}
