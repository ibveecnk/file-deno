const Readable = ["", "txt", "md", "README", "html", "css"];
const PathRegex = /^\.?\/(?:[^/]+\/)*[^/]+\/?$/;
type HtmlParams = {
  param: string;
  value: string;
};

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
 *
 * @example
 * // text = `<pre style="font-weight: bold;" class="test">text</pre>`
 * text = wrapHtml(text, "pre",
 *        [
 *          { param: "style", value: "font-weight: bold;" },
 *          { param: "class", value: "test" },
 *        ]);
 *
 * @param content the content in the html-node, can be html itself
 * @param tag the html tag to wrap around content
 * @param params parameters after tag (e.g. `class="abc"`)
 *
 * @returns a new html string
 */
export const wrapHtml = (
  content: string,
  tag: string,
  params?: HtmlParams[]
) => {
  let pStr = "";
  params?.forEach((p) => {
    pStr += `${p.param}="${p.value}" `;
  });
  pStr.trim();
  return `<${tag} ${pStr}>\n${content}\n</${tag}>`;
};
