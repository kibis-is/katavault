// enums
import { EventEnum } from '@/enums';

// events
import BaseEvent from './BaseEvent';

export default class SettingsUpdatedEvent extends BaseEvent {
  public constructor(username: string) {
    super(EventEnum.SettingsUpdated, username);
  }
}
