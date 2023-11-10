/** Converts a URL into a file name that can be saved locally. */
export function cleanUrl(url: string) {
  let fileName = url
    .replace(/(^\w+:|^)\/\/(www\.)?/, "")
    .replace(/[^a-zA-Z0-9]+/g, "_");
  const maxLength = 50;
  if (fileName.length > maxLength) {
    fileName = fileName.substring(0, maxLength);
  }
  return fileName;
}

/** Creates a very simple SHA256 hash of a string. */
export const hash = async (str: string, len: number = 10) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashHex.substring(0, len);
};
