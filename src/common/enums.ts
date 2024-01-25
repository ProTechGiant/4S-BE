export enum RoleTypes {
  USER = "user",
  ADMIN = "admin",
}
export enum OrderBy {
  ASC = "ASC",
  DESC = "DESC",
}
export enum objectState {
  INSERT = "insert",
  UPDATE = "update",
  DELETE = "delete",
  HARD_DELETE = "hard_delete",
  BULK_INSERT = "bulk_insert",
}

export enum JoinTypes {
  INNER_JOIN = "INNER JOIN",
  LEFT_JOIN = "LEFT JOIN",
}

export enum LevelState {
  LEVEL1 = 1,
  LEVEL2 = 2,
  LEVEL3 = 3,
}

export enum PERMISSIONS_TYPES {
  WRITE = "canWrite",
  READ = "canRead",
  UPDATE = "canUpdate",
  DELETE = "canDelete",
}

export enum RESOURCES_TYPES {
  USER = "User",
  ASSET = "Asset",
  BUILDING = "WirepasBuilding",
  FLOORLEVEL = "WirepasFloorlevel",
  ALERT_RULE = "AlertRule",
  ALERT = "Alert",
  PERSONNEL = "Personnel",
  SENSOR = "Sensor",
  WIREPAS_SENSORS = "WirepasSensor",
  NARROWBAND_SENSORS = "NarrowbandSensor",
  AREA = "Area",
  ROLE = "Role",
  RESOURCE = "Resource",
  USER_PROFILE = "UserProfile",
}

export enum EntityType {
  USER = "User",
  ASSET = "Asset",
  BUILDING = "WirepasBuilding",
  FLOORLEVEL = "WirepasFloorlevel",
  ALERT_RULE = "AlertRule",
  ALERT = "Alert",
  PERSONNEL = "Personnel",
  SENSOR = "Sensor",
  WIREPAS_SENSORS = "WirepasSensor",
  NARROWBAND_SENSORS = "NarrowbandSensor",
  AREA = "Area",
  ROLE = "Role",
  SITE = "Site",
  USER_PROFILE = "UserProfile",
}

export enum AlertTypes {
  PERSONNEL = "personnel",
  ASSET = "asset",
  SITE = "site",
  LOW_BATTERY = "low battery",
  SOS = "sos",
  SHUTDOWN = "shutdown",
  PICK_OFF = "pick off",
  SIT_FOR_LONG_TIME = "sit for a long time",
  LOCATION_ALERT = "location_alert",
  SHAKE = "shake",
  WEAR = "Wear",
  UNPACKING_ALARM = "Unpacking Alarm",
  CHARGE = "charge",
  UNPLUG_THE_POWER = "Unplug the power",
  SIGN_IN = "Sign in",
  SIGN_OUT = "Sign out",
  MANUAL_SOS_SHUTDOWN = "Manual sos shutdown",
  MOVED_INSIDE_AREA = "Moved Inside Area",
  MOVED_OUTSIDE_AREA = "Moved Outside Area",
}

export enum ActionType {
  EMAIL = "email",
  SMS = "sms",
  NOTIFY = "notify",
  CUSTOM = "custom",
}

export enum AlertSeverity {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export enum AlertCriteriaTypes {
  MEASURMENTBOUND = "measurment bound",
  INDOORBOUND = "indoor bound",
  OUTDOORBOUND = "outdoor bound",
}

export enum ChartTypes {
  PIE_CHART = "pieChart",
  HISTO_GRAM = "histoGrim",
}
