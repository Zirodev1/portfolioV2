/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - The text to slugify
 * @returns {string} - URL-friendly slug
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/&/g, '-and-')   // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
};

/**
 * Generate a unique slug by checking against existing slugs
 * @param {string} text - The text to slugify
 * @param {Function} checkSlugExists - Async function to check if a slug already exists
 * @returns {Promise<string>} - Unique URL-friendly slug
 */
const generateUniqueSlug = async (text, checkSlugExists) => {
  let slug = slugify(text);
  let uniqueSlug = slug;
  let suffix = 1;
  
  // Check if slug exists, if so, append a number
  while (await checkSlugExists(uniqueSlug)) {
    uniqueSlug = `${slug}-${suffix}`;
    suffix++;
  }
  
  return uniqueSlug;
};

module.exports = { slugify, generateUniqueSlug };