import { RESOURCES_TYPES } from "../enums";

export const getFriendlyName = (value: string): string => {
  const resourceTypeMapping = {
    [RESOURCES_TYPES.BUILDING]: "Building",
    [RESOURCES_TYPES.AREA]: "Area",
    [RESOURCES_TYPES.ASSET_SENSOR]: "Asset Sensor",
    [RESOURCES_TYPES.FLOORLEVEL]: "Floorlevel",
    [RESOURCES_TYPES.ALERT_RULE]: "Alert Rule",
    [RESOURCES_TYPES.SENSOR]: "Sensor",
    [RESOURCES_TYPES.WIREPAS_SENSORS]: "Wirepas Sensor",
    [RESOURCES_TYPES.NARROWBAND_SENSORS]: "Narrowband Sensor",
  };

  const friendlyName = resourceTypeMapping[value];

  if (friendlyName) {
    return friendlyName;
  } else {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
};
