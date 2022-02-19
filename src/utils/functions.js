const validImageTypes = ['png', 'gif', 'jpeg', 'jpg', 'webp'];
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

  /**
   * @param {Array} votes The array of votes to calculate a grade from
   * @returns {String} Will return a letter grade, or 'oops' if invalid
   */
  grade (votes) {
    if (!votes || votes.length < 1) return 'oops';
    const numberGrade = Math.round((votes.filter(x => x.approve).length / votes.length) * 100);
    let letterGrade = '';
    if (numberGrade >= 97) {
      letterGrade = 'A+';
    } else if (numberGrade >= 93) {
      letterGrade = 'A';
    } else if (numberGrade >= 90) {
      letterGrade = 'A-';
    } else if (numberGrade >= 87) {
      letterGrade = 'B+';
    } else if (numberGrade >= 83) {
      letterGrade = 'B';
    } else if (numberGrade >= 80) {
      letterGrade = 'B-';
    } else if (numberGrade >= 77) {
      letterGrade = 'C+';
    } else if (numberGrade >= 73) {
      letterGrade = 'C';
    } else if (numberGrade >= 70) {
      letterGrade = 'C-';
    } else if (numberGrade >= 67) {
      letterGrade = 'D+';
    } else if (numberGrade >= 63) {
      letterGrade = 'D';
    } else if (numberGrade >= 60) {
      letterGrade = 'D-';
    } else {
      letterGrade = 'F';
    }
    return letterGrade;
  }
};
