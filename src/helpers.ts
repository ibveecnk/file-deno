const Readable = ["", "txt", "md", "README", "html", "css"];

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
