interface AVMStatusResponse {
  catchpoint?: string;
  'catchpoint-acquired-blocks'?: number;
  'catchpoint-processed-accounts'?: number;
  'catchpoint-processed-kvs'?: number;
  'catchpoint-total-accounts'?: number;
  'catchpoint-total-blocks'?: number;
  'catchpoint-total-kvs'?: number;
  'catchpoint-verified-accounts'?: number;
  'catchpoint-verified-kvs'?: number;
  'catchup-time': number;
  'last-catchpoint'?: string;
  'last-round': number;
  'last-version': string;
  'next-version': string;
  'next-version-round': number;
  'next-version-supported': boolean;
  'stopped-at-unsupported-round': boolean;
  'time-since-last-round': number;
  'upgrade-delay'?: number;
  'upgrade-next-protocol-vote-before'?: number;
  'upgrade-no-votes'?: number;
  'upgrade-node-vote'?: boolean;
  'upgrade-vote-rounds'?: number;
  'upgrade-votes'?: number;
  'upgrade-votes-required'?: number;
  'upgrade-yes-votes'?: number;
}

export default AVMStatusResponse;
