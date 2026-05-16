const fs = require("fs");
const path = require("path");

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const saveImage = (imageBuffer, originalName, dir) => {
    const imageName = `${Date.now()}-${originalName}`;
    fs.writeFileSync(path.join(dir, imageName), imageBuffer);
    return imageName;
};

const deleteOldImage = (imagePath) => {
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
};

const deleteImage = (imagePath) => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Failed to delete image:", err);
                    reject(err);
                } else {
                    console.log("Image deleted successfully:", imagePath);
                    resolve();
                }
            });
        } else {
            resolve(); // File tidak ada, tetap resolusi untuk menghindari error
        }
    });
};

module.exports = {
    ensureDir,
    saveImage,
    deleteOldImage,
    deleteImage,
};
