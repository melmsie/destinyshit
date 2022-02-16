const validImageTypes = ['png', 'gif', 'jpeg', 'jpg', 'webp']
module.exports = class MiscFunctions {
  /**
   * @param {String} url The "image" url to validate the suffix
   * @param {String} contentType The content type field from a resolved image
   * @returns {Boolean} True if it's a valid image, false otherwise
   */
   validateImage (url, contentType = 'image') {
     if (!url) return false;
     const [suffix] = url.split('.').slice(-1);
     if (validImageTypes.includes(suffix) && contentType.includes('image')) {
       return true;
     }
   }
}