import { uuid } from '@stablelib/uuid';

// types
import { EventEnum } from '@/enums';

export default class BaseEvent extends CustomEvent<Record<'id', string>> {
  public constructor(type: EventEnum) {
    super(type, {
      detail: {
        id: uuid(),
      },
    });
  }
}
