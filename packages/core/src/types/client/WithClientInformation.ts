// types
import type ClientInformation from './ClientInformation';

type WithClientInformation<Type> = Type & Record<'clientInformation', ClientInformation>;

export default WithClientInformation;
