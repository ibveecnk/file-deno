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

export const wrapHtml = (content: string, wrapper: string) => {
  return `<${wrapper}>\n${content}\n</${wrapper}>`;
};
