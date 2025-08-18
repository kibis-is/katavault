/**
 * @property {string} hostname - The hostname of the client i.e., example.com.
 * @property {string} [icon] - An icon URL for the client.
 * @property {string} name - A human-readable name for the client.
 */
interface ClientInformation {
  hostname: string;
  icon?: string;
  name: string;
}

export default ClientInformation;
