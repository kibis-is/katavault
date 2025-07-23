// enums
import { ConnectorIDEnum } from '@/enums';

type WithConnectorID<Type> = Type & Record<'connectorID', ConnectorIDEnum>;

export default WithConnectorID;
