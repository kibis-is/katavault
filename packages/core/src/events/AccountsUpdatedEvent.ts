// enums
import { EventEnum } from '@/enums';

// events
import BaseEvent from './BaseEvent';

export default class AccountsUpdatedEvent extends BaseEvent {
  public constructor(username: string) {
    super(EventEnum.AccountsUpdated, username);
  }
}
