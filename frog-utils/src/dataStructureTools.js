// @flow

import type { dataUnitT, activityDataT } from './types';

// takes a single dataUnit, config object, or both, for all students, and wraps them in a proper
// activityDataT structure
export const wrapUnitAll = (
  data: dataUnitT = {},
  config: Object = {}
): activityDataT => ({
  structure: 'all',
  payload: { all: { data, config } }
});