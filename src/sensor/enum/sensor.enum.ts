export enum SensorTypes {
  GEO = "geo",
  TEMPERATURE = "temperature",
}

export enum SensorProtocolTypes {
  BLE = "ble",
  WIREPAS = "wirepas",
  NARROWBAND = "narrowband",
  LORA = "lora",
}

export enum SensorUploadDataTypes {
  NARROWBAND_SENSOR_EVENT = "narrowband_sensor_event",
  NARROWBAND_SENSORS_CSV = "narrowband_sensors_csv",
  WIREPAS_SENSORS_CSV = "wirepas_sensors_csv",
  LORA_SENSORS_CSV = "lora_sensors_csv",
}
