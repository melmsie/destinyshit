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
    if (!votes || votes.length < 1) return 'No Grade Yet';
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

  /**
   * Creates an array of strings from a given string, each string being at most 2000 characters/the given limit
   * @param {String} text The text to create an array of "pages" from
   * @param {Number} [limit=2000] The limit of characters for a page, defaults to `2000`
   * @returns {Array<String>} The given text, paginated into an array according to the specified limit
   */
  paginate (text, limit = 4096) {
    const lines = text;
    const pages = [];

    let chunk = '';

    for (const line of lines) {
      if (chunk.length + line.length > limit && chunk.length > 0) {
        pages.push(chunk);
        chunk = '';
      }

      if (line.length > limit) {
        const lineChunks = line.length / limit;

        for (let i = 0; i < lineChunks; i++) {
          const start = i * limit;
          const end = start + limit;
          pages.push(line.slice(start, end));
        }
      } else {
        chunk += `${line}\n`;
      }
    }

    if (chunk.length > 0) {
      pages.push(chunk);
    }

    return pages;
  }
};
