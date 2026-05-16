const {
    Artikel,
    Tag,
    ArtikelTag,
    ArticlesViewer,
    SubArtikel,
    GambarArtikel,
    sequelize,
} = require("../models");
const fs = require("fs");
const path = require("path");
const { exit } = require("process");
const slugify = require("slugify");

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Create
exports.create = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            penulis,
            judul,
            judulEn,
            deskripsi,
            deskripsiEn,
            tanggal,
            keteranganGambar,
            tautanGambar,
            altGambar,
            tags,
            subArtikels, // array JSON subartikel
        } = req.body;

        let gambarId = null;

        // Cari file utama artikel dari req.files
        const mainFile = req.files.find((f) => f.fieldname === "gambar");

        if (mainFile) {
            const dir = "public/images/artikels";
            ensureDir(dir);

            const gambar_name = `${Date.now()}-${mainFile.originalname}`;
            await fs.promises.writeFile(
                path.join(dir, gambar_name),
                mainFile.buffer,
            );

            // simpan ke tabel GambarArtikels
            const gambarArtikel = await GambarArtikel.create(
                {
                    nama: gambar_name,
                    keterangan: keteranganGambar,
                    tautan: tautanGambar,
                    alt: altGambar,
                },
                { user: req.user.username, transaction: t },
            );

            gambarId = gambarArtikel.id;
        }

        // 1. Buat artikel utama
        const artikel = await Artikel.create(
            {
                penulis,
                judul,
                judulEn,
                slug: slugify(judul, { replacement: "-", lower: true }),
                deskripsi,
                deskripsiEn,
                tanggal,
                gambarId: gambarId,
            },
            { user: req.user.username, transaction: t },
        );

        // 2. Tambahkan tags
        if (tags) {
            const tagArray = tags
                .split(",")
                .map((tagId) => parseInt(tagId.trim()));
            const validTags = await Tag.findAll({
                where: { id: tagArray },
                transaction: t,
            });

            if (validTags.length !== tagArray.length) {
                await t.rollback();
                return res.status(400).json({ message: "Tag tidak ada" });
            }

            await artikel.setTags(validTags, {
                user: req.user.username,
                transaction: t,
            });
        }

        // 3. Tambahkan subartikels (jika ada)
        if (subArtikels) {
            const parsedSubArtikels =
                typeof subArtikels === "string"
                    ? JSON.parse(subArtikels)
                    : subArtikels;

            for (const [index, sub] of parsedSubArtikels.entries()) {
                let subGambarId = null;

                // Cari file subartikel sesuai fieldname
                const subFile = req.files.find(
                    (f) => f.fieldname === `subArtikels[${index}][file]`,
                );

                if (subFile) {
                    const dir = "public/images/artikels/subartikels";
                    ensureDir(dir);

                    const subGambarName = `${Date.now()}-${subFile.originalname}`;
                    await fs.promises.writeFile(
                        path.join(dir, subGambarName),
                        subFile.buffer,
                    );

                    const subGambar = await GambarArtikel.create(
                        {
                            nama: subGambarName,
                            keterangan: sub.keteranganGambar,
                            tautan: sub.tautanGambar,
                            alt: sub.altGambar,
                        },
                        { user: req.user.username, transaction: t },
                    );

                    subGambarId = subGambar.id;
                }

                await SubArtikel.create(
                    {
                        judul: sub.judul,
                        deskripsi: sub.deskripsi,
                        gambarId: subGambarId || sub.gambarId || null,
                        artikelId: artikel.id,
                        createdBy: req.user.username,
                    },
                    { user: req.user.username, transaction: t },
                );
            }
        }

        await t.commit();

        // 4. Ambil kembali artikel lengkap dengan tags dan subartikels
        const artikelWithRelations = await Artikel.findOne({
            where: { id: artikel.id },
            include: [
                { model: GambarArtikel, as: "gambarArtikel" },
                { model: Tag, as: "tags" },
                {
                    model: SubArtikel,
                    as: "subArtikels",
                    include: [{ model: GambarArtikel, as: "gambarArtikel" }],
                },
            ],
        });

        res.status(201).json({
            message: "Artikel Berhasil Ditambahkan!",
            data: artikelWithRelations,
        });
    } catch (error) {
        if (!t.finished) {
            // ✅ pastikan belum commit/rollback
            await t.rollback();
        }

        if (error.name === "SequelizeValidationError") {
            const messages = error.errors.map((err) => err.message);
            return res.status(400).json({
                message: "Validation error",
                errors: messages,
            });
        }

        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Read all
exports.findAll = async (req, res) => {
    try {
        const { lang } = req.query;
        const artikels = await Artikel.findAll({
            include: [
                {
                    model: GambarArtikel,
                    as: "gambarArtikel",
                    required: false,
                },
                {
                    model: Tag,
                    as: "tags",
                    attributes: ["id", "nama"],
                    required: false,
                },
                {
                    model: SubArtikel,
                    as: "subArtikels",
                    required: false,
                    include: [
                        {
                            model: GambarArtikel,
                            as: "gambarArtikel",
                            required: false,
                        },
                    ],
                },
            ],
        });

        // Helper function to get image data
        const getImageData = (artikel) => {
            // First check legacy gambar column
            if (artikel.gambar) {
                return artikel.gambar;
            }
            // Then check gambarArtikel association
            if (artikel.gambarArtikel) {
                return {
                    id: artikel.gambarArtikel.id,
                    nama: artikel.gambarArtikel.nama,
                    keterangan: artikel.gambarArtikel.keterangan,
                    tautan: artikel.gambarArtikel.tautan,
                    alt: artikel.gambarArtikel.alt,
                };
            }
            return null;
        };

        let data;

        if (lang === "id") {
            data = artikels.map((artikel) => ({
                id: artikel.id,
                penulis: artikel.penulis,
                judul: artikel.judul,
                deskripsi: artikel.deskripsi,
                tanggal: artikel.tanggal,
                gambar: getImageData(artikel),
                slug: artikel.slug,
                tags: artikel.tags.map((tag) => ({
                    id: tag.id,
                    nama: tag.nama,
                })),
                subArtikels: artikel.subArtikels.map((sub) => ({
                    id: sub.id,
                    judul: sub.judul,
                    deskripsi: sub.deskripsi,
                    gambar: sub.gambarArtikel
                        ? {
                              id: sub.gambarArtikel.id,
                              nama: sub.gambarArtikel.nama,
                              keterangan: sub.gambarArtikel.keterangan,
                              tautan: sub.gambarArtikel.tautan,
                              alt: sub.gambarArtikel.alt,
                          }
                        : null,
                })),
            }));
        } else if (lang === "en") {
            data = artikels.map((artikel) => ({
                id: artikel.id,
                penulis: artikel.penulis,
                judul: artikel.judulEn,
                deskripsi: artikel.deskripsiEn,
                tanggal: artikel.tanggal,
                gambar: getImageData(artikel),
                slug: artikel.slug,
                tags: artikel.tags.map((tag) => ({
                    id: tag.id,
                    nama: tag.nama,
                })),
                subArtikels: artikel.subArtikels.map((sub) => ({
                    id: sub.id,
                    judul: sub.judulEn,
                    deskripsi: sub.deskripsiEn,
                    gambar: sub.gambarArtikel
                        ? {
                              id: sub.gambarArtikel.id,
                              nama: sub.gambarArtikel.nama,
                              keterangan: sub.gambarArtikel.keterangan,
                              tautan: sub.gambarArtikel.tautan,
                              alt: sub.gambarArtikel.alt,
                          }
                        : null,
                })),
            }));
        } else {
            data = artikels.map((artikel) => ({
                id: artikel.id,
                penulis: artikel.penulis,
                jumlah_penglihat: artikel.jumlah_penglihat,
                judul: artikel.judul,
                deskripsi: artikel.deskripsi,
                judulEn: artikel.judulEn,
                deskripsiEn: artikel.deskripsiEn,
                tanggal: artikel.tanggal,
                gambar: getImageData(artikel),
                slug: artikel.slug,
                tags: artikel.tags.map((tag) => ({
                    id: tag.id,
                    nama: tag.nama,
                })),
                subArtikels: artikel.subArtikels.map((sub) => ({
                    id: sub.id,
                    judul: sub.judul,
                    judulEn: sub.judulEn,
                    deskripsi: sub.deskripsi,
                    deskripsiEn: sub.deskripsiEn,
                    gambar: sub.gambarArtikel
                        ? {
                              id: sub.gambarArtikel.id,
                              nama: sub.gambarArtikel.nama,
                              keterangan: sub.gambarArtikel.keterangan,
                              tautan: sub.gambarArtikel.tautan,
                              alt: sub.gambarArtikel.alt,
                          }
                        : null,
                })),
            }));
        }

        res.status(200).json({
            message: "Artikel Berhasil Didapat!",
            data,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Read one
exports.findOne = async (req, res) => {
    try {
        const { lang } = req.query;
        const artikel = await Artikel.findByPk(req.params.id, {
            include: [
                { model: GambarArtikel, as: "gambarArtikel", required: false },
                {
                    model: Tag,
                    as: "tags",
                    attributes: ["id", "nama"],
                    required: false,
                },
                {
                    model: SubArtikel,
                    as: "subArtikels",
                    required: false,
                    include: [
                        {
                            model: GambarArtikel,
                            as: "gambarArtikel",
                            required: false,
                        },
                    ],
                },
            ],
        });
        if (!artikel) {
            return res.status(404).json({ message: "Artikel tidak ada!" });
        }

        // Helper function to get image data
        const getImageData = (artikel) => {
            if (artikel.gambar) return artikel.gambar;
            if (artikel.gambarArtikel) {
                return {
                    id: artikel.gambarArtikel.id,
                    nama: artikel.gambarArtikel.nama,
                    keterangan: artikel.gambarArtikel.keterangan,
                    tautan: artikel.gambarArtikel.tautan,
                    alt: artikel.gambarArtikel.alt,
                };
            }
            return null;
        };

        let data;

        if (lang === "id") {
            data = {
                id: artikel.id,
                penulis: artikel.penulis,
                judul: artikel.judul,
                deskripsi: artikel.deskripsi,
                tanggal: artikel.tanggal,
                gambar: getImageData(artikel),
                slug: artikel.slug,
                tags: artikel.tags.map((tag) => ({
                    id: tag.id,
                    nama: tag.nama,
                })),
                subArtikels: artikel.subArtikels.map((sub) => ({
                    id: sub.id,
                    judul: sub.judul,
                    deskripsi: sub.deskripsi,
                    gambar: sub.gambarArtikel
                        ? {
                              id: sub.gambarArtikel.id,
                              nama: sub.gambarArtikel.nama,
                              keterangan: sub.gambarArtikel.keterangan,
                              tautan: sub.gambarArtikel.tautan,
                              alt: sub.gambarArtikel.alt,
                          }
                        : null,
                })),
            };
        } else if (lang === "en") {
            data = {
                id: artikel.id,
                penulis: artikel.penulis,
                judul: artikel.judulEn,
                deskripsi: artikel.deskripsiEn,
                tanggal: artikel.tanggal,
                gambar: getImageData(artikel),
                slug: artikel.slug,
                tags: artikel.tags.map((tag) => ({
                    id: tag.id,
                    nama: tag.nama,
                })),
                subArtikels: artikel.subArtikels.map((sub) => ({
                    id: sub.id,
                    judul: sub.judulEn,
                    deskripsi: sub.deskripsiEn,
                    gambar: sub.gambarArtikel
                        ? {
                              id: sub.gambarArtikel.id,
                              nama: sub.gambarArtikel.nama,
                              keterangan: sub.gambarArtikel.keterangan,
                              tautan: sub.gambarArtikel.tautan,
                              alt: sub.gambarArtikel.alt,
                          }
                        : null,
                })),
            };
        } else {
            data = {
                id: artikel.id,
                penulis: artikel.penulis,
                jumlah_penglihat: artikel.jumlah_penglihat,
                judul: artikel.judul,
                deskripsi: artikel.deskripsi,
                judulEn: artikel.judulEn,
                deskripsiEn: artikel.deskripsiEn,
                tanggal: artikel.tanggal,
                gambar: getImageData(artikel),
                slug: artikel.slug,
                tags: artikel.tags.map((tag) => ({
                    id: tag.id,
                    nama: tag.nama,
                })),
                subArtikels: artikel.subArtikels.map((sub) => ({
                    id: sub.id,
                    judul: sub.judul,
                    judulEn: sub.judulEn,
                    deskripsi: sub.deskripsi,
                    deskripsiEn: sub.deskripsiEn,
                    gambar: sub.gambarArtikel
                        ? {
                              id: sub.gambarArtikel.id,
                              nama: sub.gambarArtikel.nama,
                              keterangan: sub.gambarArtikel.keterangan,
                              tautan: sub.gambarArtikel.tautan,
                              alt: sub.gambarArtikel.alt,
                          }
                        : null,
                })),
            };
        }
        res.status(200).json({
            message: "Artikel Berhasil Didapat!",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Read one By Slug
exports.findDataBySlug = async (req, res) => {
    try {
        const { lang } = req.query;
        const artikel = await Artikel.findOne({
            where: { slug: req.params.slug },
            include: [
                { model: GambarArtikel, as: "gambarArtikel", required: false },
                {
                    model: Tag,
                    as: "tags",
                    attributes: ["id", "nama"],
                    required: false,
                },
                {
                    model: SubArtikel,
                    as: "subArtikels",
                    required: false,
                    include: [
                        {
                            model: GambarArtikel,
                            as: "gambarArtikel",
                            required: false,
                        },
                    ],
                },
            ],
        });

        if (!artikel) {
            return res.status(404).json({ message: "Artikel tidak ada!" });
        }

        // Helper function to get image data
        const getImageData = (artikel) => {
            if (artikel.gambar) return artikel.gambar;
            if (artikel.gambarArtikel) {
                return {
                    id: artikel.gambarArtikel.id,
                    nama: artikel.gambarArtikel.nama,
                    keterangan: artikel.gambarArtikel.keterangan,
                    tautan: artikel.gambarArtikel.tautan,
                    alt: artikel.gambarArtikel.alt,
                };
            }
            return null;
        };

        let data;

        if (lang === "id") {
            data = {
                id: artikel.id,
                penulis: artikel.penulis,
                judul: artikel.judul,
                deskripsi: artikel.deskripsi,
                tanggal: artikel.tanggal,
                gambar: getImageData(artikel),
                slug: artikel.slug,
                tags: artikel.tags.map((tag) => ({
                    id: tag.id,
                    nama: tag.nama,
                })),
                subArtikels: artikel.subArtikels.map((sub) => ({
                    id: sub.id,
                    judul: sub.judul,
                    deskripsi: sub.deskripsi,
                    gambar: sub.gambarArtikel
                        ? {
                              id: sub.gambarArtikel.id,
                              nama: sub.gambarArtikel.nama,
                              keterangan: sub.gambarArtikel.keterangan,
                              tautan: sub.gambarArtikel.tautan,
                              alt: sub.gambarArtikel.alt,
                          }
                        : null,
                })),
            };
        } else if (lang === "en") {
            data = {
                id: artikel.id,
                penulis: artikel.penulis,
                judul: artikel.judulEn,
                deskripsi: artikel.deskripsiEn,
                tanggal: artikel.tanggal,
                gambar: getImageData(artikel),
                slug: artikel.slug,
                tags: artikel.tags.map((tag) => ({
                    id: tag.id,
                    nama: tag.nama,
                })),
                subArtikels: artikel.subArtikels.map((sub) => ({
                    id: sub.id,
                    judul: sub.judulEn,
                    deskripsi: sub.deskripsiEn,
                    gambar: sub.gambarArtikel
                        ? {
                              id: sub.gambarArtikel.id,
                              nama: sub.gambarArtikel.nama,
                              keterangan: sub.gambarArtikel.keterangan,
                              tautan: sub.gambarArtikel.tautan,
                              alt: sub.gambarArtikel.alt,
                          }
                        : null,
                })),
            };
        } else {
            data = {
                id: artikel.id,
                penulis: artikel.penulis,
                jumlah_penglihat: artikel.jumlah_penglihat,
                judul: artikel.judul,
                deskripsi: artikel.deskripsi,
                judulEn: artikel.judulEn,
                deskripsiEn: artikel.deskripsiEn,
                tanggal: artikel.tanggal,
                gambar: getImageData(artikel),
                slug: artikel.slug,
                tags: artikel.tags.map((tag) => ({
                    id: tag.id,
                    nama: tag.nama,
                })),
                subArtikels: artikel.subArtikels.map((sub) => ({
                    id: sub.id,
                    judul: sub.judul,
                    judulEn: sub.judulEn,
                    deskripsi: sub.deskripsi,
                    deskripsiEn: sub.deskripsiEn,
                    gambar: sub.gambarArtikel
                        ? {
                              id: sub.gambarArtikel.id,
                              nama: sub.gambarArtikel.nama,
                              keterangan: sub.gambarArtikel.keterangan,
                              tautan: sub.gambarArtikel.tautan,
                              alt: sub.gambarArtikel.alt,
                          }
                        : null,
                })),
            };
        }

        res.status(200).json({
            message: "Artikel Berhasil didapat!",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Update
exports.update = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const {
            penulis,
            judul,
            judulEn,
            deskripsi,
            deskripsiEn,
            tanggal,
            keteranganGambar,
            tautanGambar,
            altGambar,
            tags,
            subArtikels,
        } = req.body;

        // 1. Cari artikel
        const artikel = await Artikel.findByPk(id, { transaction: t });
        if (!artikel) {
            await t.rollback();
            return res.status(404).json({ message: "Artikel tidak ditemukan" });
        }

        let gambarId = artikel.gambarId;

        // 2. Update gambar utama (jika ada upload baru)
        if (req.files && req.files.length > 0) {
            const mainFile = req.files.find((f) => f.fieldname === "gambar");

            if (mainFile) {
                const dir = "public/images/artikels";
                ensureDir(dir);

                const gambar_name = `${Date.now()}-${mainFile.originalname}`;
                await fs.promises.writeFile(
                    path.join(dir, gambar_name),
                    mainFile.buffer,
                );

                const gambarArtikel = await GambarArtikel.create(
                    {
                        nama: gambar_name,
                        keterangan: keteranganGambar,
                        tautan: tautanGambar,
                        alt: altGambar,
                    },
                    { user: req.user.username, transaction: t },
                );

                gambarId = gambarArtikel.id;
            }
        }

        // 3. Update artikel utama
        await artikel.update(
            {
                penulis,
                judul,
                judulEn,
                slug: slugify(judul, { replacement: "-", lower: true }),
                deskripsi,
                deskripsiEn,
                tanggal,
                gambarId,
            },
            { user: req.user.username, transaction: t },
        );

        // 4. Update tags
        if (tags) {
            const tagArray = tags
                .split(",")
                .map((tagId) => parseInt(tagId.trim()));
            const validTags = await Tag.findAll({
                where: { id: tagArray },
                transaction: t,
            });

            if (validTags.length !== tagArray.length) {
                await t.rollback();
                return res.status(400).json({ message: "Tag tidak ada" });
            }

            await artikel.setTags(validTags, {
                user: req.user.username,
                transaction: t,
            });
        }

        // 5. Update subartikels
        if (subArtikels) {
            const parsedSubArtikels =
                typeof subArtikels === "string"
                    ? JSON.parse(subArtikels)
                    : subArtikels;

            // ambil semua subartikel lama
            const existingSubs = await SubArtikel.findAll({
                where: { artikelId: artikel.id },
                transaction: t,
            });

            // kumpulkan id subartikel yang dikirim dari frontend
            const incomingIds = parsedSubArtikels
                .filter((s) => s.id)
                .map((s) => Number(s.id));

            // hapus subartikel lama yang tidak ada di request
            for (const oldSub of existingSubs) {
                if (!incomingIds.includes(oldSub.id)) {
                    await oldSub.destroy({ transaction: t });
                }
            }

            // proses create/update
            for (const [index, sub] of parsedSubArtikels.entries()) {
                let subGambarId = sub.gambarId || null;

                // cek apakah ada file baru
                const subFile =
                    req.files?.find(
                        (f) => f.fieldname === `subArtikels[${index}][file]`,
                    ) || null;

                if (subFile) {
                    const dir = "public/images/artikels/subartikels";
                    ensureDir(dir);

                    const subGambarName = `${Date.now()}-${subFile.originalname}`;
                    await fs.promises.writeFile(
                        path.join(dir, subGambarName),
                        subFile.buffer,
                    );

                    const subGambar = await GambarArtikel.create(
                        {
                            nama: subGambarName,
                            keterangan: sub.keteranganGambar,
                            tautan: sub.tautanGambar,
                            alt: sub.altGambar,
                        },
                        { user: req.user.username, transaction: t },
                    );

                    subGambarId = subGambar.id;
                }

                if (sub.id) {
                    // ambil subartikel lama
                    const existingSub = await SubArtikel.findByPk(sub.id, {
                        include: [
                            { model: GambarArtikel, as: "gambarArtikel" },
                        ],
                        transaction: t,
                    });

                    if (!existingSub) {
                        throw new Error(
                            `SubArtikel dengan id ${sub.id} tidak ditemukan`,
                        );
                    }

                    let subGambarId = existingSub.gambarId;

                    // cek apakah ada file baru
                    const subFile =
                        req.files?.find(
                            (f) =>
                                f.fieldname === `subArtikels[${index}][file]`,
                        ) || null;

                    if (subFile) {
                        // upload file baru
                        const dir = "public/images/artikels/subartikels";
                        ensureDir(dir);

                        const subGambarName = `${Date.now()}-${subFile.originalname}`;
                        await fs.promises.writeFile(
                            path.join(dir, subGambarName),
                            subFile.buffer,
                        );

                        // buat gambar baru
                        const subGambar = await GambarArtikel.create(
                            {
                                nama: subGambarName,
                                keterangan:
                                    sub.keteranganGambar ??
                                    existingSub.gambarArtikel?.keterangan,
                                tautan:
                                    sub.tautanGambar ??
                                    existingSub.gambarArtikel?.tautan,
                                alt:
                                    sub.altGambar ??
                                    existingSub.gambarArtikel?.alt,
                            },
                            { user: req.user.username, transaction: t },
                        );

                        subGambarId = subGambar.id;
                    } else if (subGambarId) {
                        // kalau tidak ada file baru tapi ada gambar lama → update metadata saja
                        await GambarArtikel.update(
                            {
                                keterangan:
                                    sub.keteranganGambar ??
                                    existingSub.gambarArtikel?.keterangan,
                                tautan:
                                    sub.tautanGambar ??
                                    existingSub.gambarArtikel?.tautan,
                                alt:
                                    sub.altGambar ??
                                    existingSub.gambarArtikel?.alt,
                            },
                            { where: { id: subGambarId }, transaction: t },
                        );
                    }

                    // update subartikel
                    await SubArtikel.update(
                        {
                            judul: sub.judul,
                            deskripsi: sub.deskripsi,
                            gambarId: subGambarId,
                        },
                        {
                            where: { id: sub.id, artikelId: artikel.id },
                            transaction: t,
                        },
                    );
                } else {
                    // buat subartikel baru
                    await SubArtikel.create(
                        {
                            judul: sub.judul,
                            deskripsi: sub.deskripsi,
                            gambarId: subGambarId,
                            artikelId: artikel.id,
                        },
                        { user: req.user.username, transaction: t },
                    );
                }
            }
        }

        await t.commit();

        // 6. Return artikel dengan relasi
        const artikelWithRelations = await Artikel.findOne({
            where: { id: artikel.id },
            include: [
                { model: GambarArtikel, as: "gambarArtikel" },
                { model: Tag, as: "tags" },
                {
                    model: SubArtikel,
                    as: "subArtikels",
                    include: [{ model: GambarArtikel, as: "gambarArtikel" }],
                },
            ],
        });

        res.status(200).json({
            message: "Artikel Berhasil Diperbarui!",
            data: artikelWithRelations,
        });
    } catch (error) {
        if (!t.finished) await t.rollback();

        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Delete
exports.delete = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const artikel = await Artikel.findByPk(req.params.id, {
            include: [
                { model: GambarArtikel, as: "gambarArtikel" },
                {
                    model: SubArtikel,
                    as: "subArtikels",
                    include: [{ model: GambarArtikel, as: "gambarArtikel" }],
                },
                { model: Tag, as: "tags" },
            ],
        });

        if (!artikel) {
            await t.rollback();
            return res.status(404).json({ message: "Artikel tidak ada!" });
        }

        // 1. Hapus semua subartikels & gambar terkait
        for (const sub of artikel.subArtikels) {
            if (sub.gambarArtikel) {
                const subImagePath = path.resolve(
                    `public/images/artikels/subartikels/${sub.gambarArtikel.nama}`,
                );
                if (fs.existsSync(subImagePath)) fs.unlinkSync(subImagePath);

                await sub.gambarArtikel.destroy({ transaction: t });
            }
            await sub.destroy({ transaction: t });
        }

        // 2. Hapus pivot ArtikelTag
        await artikel.setTags([], { transaction: t });

        // 3. Hapus artikel
        await artikel.destroy({ transaction: t });

        // 4. Hapus gambar utama setelah artikel dihapus
        if (artikel.gambarArtikel) {
            const imagePath = path.resolve(
                `public/images/artikels/${artikel.gambarArtikel.nama}`,
            );
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

            await artikel.gambarArtikel.destroy({ transaction: t });
        }

        await t.commit();

        res.status(200).json({
            message: "Artikel Berhasil Dihapus!",
            data: artikel,
        });
    } catch (error) {
        if (!t.finished) await t.rollback();
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Get Image by Name
exports.getImageByName = (req, res) => {
    const { gambar } = req.params;
    const dir = "public/images/artikels";
    const imagePath = path.join(dir, gambar);

    if (fs.existsSync(imagePath)) {
        res.sendFile(path.resolve(imagePath));
    } else {
        res.status(404).json({
            message: "Gambar tidak ditemukan",
        });
    }
};

// Get Image by Name
exports.getImageSubArtikelByName = (req, res) => {
    const { gambar } = req.params;
    const dir = "public/images/artikels/subartikels";
    const imagePath = path.join(dir, gambar);

    if (fs.existsSync(imagePath)) {
        res.sendFile(path.resolve(imagePath));
    } else {
        res.status(404).json({
            message: "Gambar tidak ditemukan",
        });
    }
};

exports.getArticleByTag = async (req, res) => {
    try {
        const { lang } = req.query;
        const tag = await Tag.findAll({
            where: { nama: req.query.tag },
            include: Artikel,
        });

        if (!tag) {
            return res.status(404).json({ message: "Tag artikel tidak ada!" });
        }

        const formattedTag = tag.map((t) => ({
            ...t.toJSON(),
            Artikels: t.Artikels.map((artikel) => ({
                id: artikel.id,
                penulis: artikel.penulis,
                judul: lang === "en" ? artikel.judulEn : artikel.judul,
                deskripsi:
                    lang === "en" ? artikel.deskripsiEn : artikel.deskripsi,
                tanggal: artikel.tanggal,
                gambar: artikel.gambar,
            })),
        }));

        res.status(200).json({
            message: "Artikel Berhasil Didapat!",
            data: formattedTag,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.articlesViewer = async (req, res) => {
    try {
        const article = await Artikel.findByPk(req.params.articleId);

        if (!article) {
            return res.status(404).json({
                message: "Artikel Tidak Ada!",
            });
        }

        // Always increment the view count
        const viewerCount = article.jumlah_penglihat + 1;

        // Update the view count in the database
        await article.update({
            jumlah_penglihat: viewerCount,
        });

        // Check if a record already exists for this article
        let articlesViewer = await ArticlesViewer.findOne({
            where: {
                articleId: article.id,
            },
        });

        if (articlesViewer) {
            // Update the existing record
            await articlesViewer.update({
                viewerCount: viewerCount,
            });
        } else {
            // Create a new record if none exists
            articlesViewer = await ArticlesViewer.create({
                articleId: article.id,
                viewerCount: viewerCount,
            });
        }

        res.status(200).json({
            message: "Artikel berhasil dibaca dan tercatat.",
            data: {
                article: {
                    id: article.id,
                    judul: article.judul,
                    jumlah_penglihat: viewerCount, // Return the incremented count
                },
                view: articlesViewer,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

//* START FUNCTION FOR PUBLIC
// Read all
exports.getAllPublic = async (req, res, next) => {
    try {
        const { lang } = req.query;
        const artikels = await Artikel.findAll({ include: Tag });

        let data;

        if (lang === "id") {
            // Jika lang = "id", hanya ambil versi Indonesia
            data = artikels.map((artikel) => ({
                id: artikel.id,
                penulis: artikel.penulis,
                judul: artikel.judul,
                deskripsi: artikel.deskripsi,
                tanggal: artikel.tanggal,
                gambar: artikel.gambar,
                slug: artikel.slug,
                tags: artikel.Tags.map((tag) => {
                    return {
                        id: tag.id,
                        nama: tag.nama,
                    };
                }),
            }));
        } else if (lang === "en") {
            // Jika lang = "en", hanya ambil versi Inggris
            data = artikels.map((artikel) => ({
                id: artikel.id,
                penulis: artikel.penulis,
                judul: artikel.judulEn,
                deskripsi: artikel.deskripsiEn,
                tanggal: artikel.tanggal,
                gambar: artikel.gambar,
                slug: artikel.slug,
                tags: artikel.Tags.map((tag) => {
                    return {
                        id: tag.id,
                        nama: tag.nama,
                    };
                }),
            }));
        } else {
            // Jika lang tidak ada, kembalikan semua kolom
            data = artikels.map((artikel) => ({
                id: artikel.id,
                penulis: artikel.penulis,
                judul: artikel.judul,
                deskripsi: artikel.deskripsi,
                judulEn: artikel.judulEn,
                deskripsiEn: artikel.deskripsiEn,
                tanggal: artikel.tanggal,
                gambar: artikel.gambar,
                slug: artikel.slug,
                tags: artikel.Tags.map((tag) => {
                    return {
                        id: tag.id,
                        nama: tag.nama,
                    };
                }),
            }));
        }

        res.status(200).json({
            message: "Artikel Berhasil Didapat!",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

// Read one By Slug
exports.getOneBySlugPublic = async (req, res, next) => {
    try {
        const { lang } = req.query;
        const artikel = await Artikel.findOne({
            where: { slug: req.params.slug },
            include: Tag,
        });

        if (!artikel) {
            return res.status(404).json({ message: "Artikel tidak ada!" });
        }

        let data;

        if (lang === "id") {
            // Jika lang = "id", hanya ambil versi Indonesia
            data = {
                id: artikel.id,
                penulis: artikel.penulis,
                judul: artikel.judul,
                deskripsi: artikel.deskripsi,
                tanggal: artikel.tanggal,
                gambar: artikel.gambar,
                slug: artikel.slug,
                tags: artikel.Tags.map((tag) => {
                    return {
                        id: tag.id,
                        nama: tag.nama,
                    };
                }),
            };
        } else if (lang === "en") {
            // Jika lang = "en", hanya ambil versi Inggris
            data = {
                id: artikel.id,
                penulis: artikel.penulis,
                judul: artikel.judulEn,
                deskripsi: artikel.deskripsiEn,
                tanggal: artikel.tanggal,
                gambar: artikel.gambar,
                slug: artikel.slug,
                tags: artikel.Tags.map((tag) => {
                    return {
                        id: tag.id,
                        nama: tag.nama,
                    };
                }),
            };
        } else {
            // Jika lang tidak ada, kembalikan semua kolom
            data = {
                id: artikel.id,
                penulis: artikel.penulis,
                judul: artikel.judul,
                deskripsi: artikel.deskripsi,
                judulEn: artikel.judulEn,
                deskripsiEn: artikel.deskripsiEn,
                tanggal: artikel.tanggal,
                gambar: artikel.gambar,
                slug: artikel.slug,
                tags: artikel.Tags.map((tag) => {
                    return {
                        id: tag.id,
                        nama: tag.nama,
                    };
                }),
            };
        }

        res.status(200).json({
            message: "Artikel Berhasil didapat!",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

// Get Image by Name
exports.getImageByNamePublic = (req, res) => {
    const { imageName } = req.params;
    const dir = "public/images/artikels";
    const imagePath = path.join(dir, imageName);

    if (fs.existsSync(imagePath)) {
        res.sendFile(path.resolve(imagePath));
    } else {
        res.status(404).json({
            message: "Gambar tidak ditemukan",
        });
    }
};

// Get Image by Name
exports.getImageByNamePublic = (req, res) => {
    const { imageName } = req.params;
    const dir = "public/images/artikels";
    const imagePath = path.join(dir, imageName);

    if (fs.existsSync(imagePath)) {
        res.sendFile(path.resolve(imagePath));
    } else {
        res.status(404).json({
            message: "Gambar tidak ditemukan",
        });
    }
};
//* END FUNCTION FOR PUBLIC
