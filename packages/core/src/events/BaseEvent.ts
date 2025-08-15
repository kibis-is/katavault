import { uuid } from '@stablelib/uuid';

// types
import { EventEnum } from '@/enums';

export default class BaseEvent extends CustomEvent<Record<'id' | 'username', string>> {
  public constructor(type: EventEnum, username: string) {
    super(type, {
      detail: {
        id: uuid(),
        username,
      },
    });
  }
}
