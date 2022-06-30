const Readable = ["", "txt", "md", "README", "html", "css"];
const PathRegex = /^\.?\/(?:[^/]+\/)*[^/]+\/?$/;

/**
 * Check if a file is human-readable by its extension
 * @param ext the extension of the File
 * @returns is the files plain text human readable?
 */
export const isReadable = (ext: string) => {
  ext = ext.trim().replaceAll(".", "");
  if (Readable.includes(ext)) {
    return true;
  }
  return false;
};

/**
 * Checks if a path given is valid
 * @param path the path to check
 * @returns is the path valid?
 */
export const isValidPath = (path: string) => {
  return !!path.match(PathRegex);
};

/**
 * Wraps content in html tag
 * @param content the content in the html-node, can be html itself
 * @param tag the html tag to wrap around content
 * @param params parameters after tag (e.g. `class="abc"`)
 * @returns a new html string
 */
export const wrapHtml = (content: string, tag: string, params?: string) => {
  return `<${tag} ${params}>\n${content}\n</${tag}>`;
};
