const cloudinary = require('cloudinary').v2;

const deleteFromCloudinary = (imgUrl) => {
  if (imgUrl.includes('cloudinary')) {
    const urlSplit = imgUrl.split('/');
    const folderName = urlSplit.at(-2);
    const fileName = urlSplit.at(-1).split('.')[0];

    const finalUrl = `BoardgamesApi/${folderName}/${fileName}`;
    cloudinary.uploader.destroy(finalUrl, () => {
      console.log('Imagen eliminada en Cloudinary');
    });
  }
};

module.exports = { deleteFromCloudinary };
