/**
 * Gets the title of the client.
 * @returns {string} The meta "application-name" or fallsback to the document title.
 */
export default function documentTitle(): string {
  return document.querySelector('meta[name="application-name"]')?.getAttribute('content') || document.title;
}
