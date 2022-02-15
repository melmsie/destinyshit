const validImageTypes = ['png', 'gif', 'jpeg', 'jpg', 'webp']
module.exports = class MiscFunctions {
  /**
   * @param {String} filename Pass along the file name to verify it ends in a valid image format
   * @returns {Boolean} True if it's a valid image, false otherwise
   */
   validateImage (filename) {
     if (!filename) return false;
     const [fileType] = filename.split('.').slice(-1);
     if (validImageTypes.includes(fileType)) {
       return true;
     }
   }
}