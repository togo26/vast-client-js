import { createCreative } from './creative';

export function createCreativeLinear(creativeAttributes = {}) {
  const { id, adId, sequence, apiFramework } = createCreative(
    creativeAttributes
  );
  return {
    id,
    adId,
    sequence,
    apiFramework,
    type: 'linear',
    duration: 0,
    skipDelay: null,
    mediaFiles: [],
    mezzanine: null,
    videoClickThroughURLTemplate: null,
    videoClickTrackingURLTemplates: [],
    videoCustomClickURLTemplates: [],
    adParameters: null,
    icons: [],
    trackingEvents: {}
  };
}

export function isCreativeLinear(creativeLinear) {
  return creativeLinear.type === 'linear';
}
