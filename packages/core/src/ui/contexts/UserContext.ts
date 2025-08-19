import { createContext } from 'preact';

const UserContext = createContext<string | null>(null);

export default UserContext;
