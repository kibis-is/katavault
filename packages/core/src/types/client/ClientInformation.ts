/**
 * @property {string} host - The client host.
 * @property {string} icon - [optional] An icon URL for the client.
 * @property {string} name - A human-readable name for the client.
 */
interface ClientInformation {
  host: string;
  icon?: string;
  name: string;
}

export default ClientInformation;
