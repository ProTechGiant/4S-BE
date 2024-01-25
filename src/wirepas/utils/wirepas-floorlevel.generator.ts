import { v4 as uuidv4 } from "uuid";
import { WirepasFloorlevelDtos } from "../dto/wirepas-floorlevel.dto";

export const getInputForCreateWntFloorLevel = (input: WirepasFloorlevelDtos.CreateWirepasFloorlevelDto) => {
  const data = {
    originator_token: uuidv4(),
    buildings: [
      {
        id: input.wirepasBuildingId,
        floor_plans: [
          {
            image_width: null,
            image_height: null,
            name: input.name,
            level: input.level,
            distance_in_m: input.distanceInM ?? 1,
            altitude_leftbottom: input.altitudeLeftbottom ?? null,
            altitude_lefttop: input.altitudeLefttop ?? null,
            altitude_rightbottom: input.altitudeRightbottom ?? null,
            altitude_righttop: input.altitudeRighttop ?? null,
            latitude_leftbottom: input.latitudeLeftbottom ?? null,
            latitude_lefttop: input.latitudeLefttop ?? null,
            latitude_rightbottom: input.latitudeRightbottom ?? null,
            latitude_righttop: input.latitudeRighttop ?? null,
            longitude_leftbottom: input.longitudeLeftbottom ?? null,
            longitude_lefttop: input.longitudeLefttop ?? null,
            longitude_rightbottom: input.longitudeRightbottom ?? null,
            longitude_righttop: input.longitudeRighttop ?? null,
            x_distance_point1: input.xDistancePoint1 ?? 0,
            x_distance_point2: input.xDistancePoint2 ?? 0,
            x_normcoord_lefttop: input.xNormcoordLefttop ?? 0,
            x_normcoord_leftbottom: input.xNormcoordLeftbottom ?? 0,
            x_normcoord_righttop: input.xNormcoordRighttop ?? 1,
            x_normcoord_rightbottom: input.xNormcoordRightbottom ?? 1,
            y_distance_point1: input.yDistancePoint1 ?? 0,
            y_distance_point2: input.yDistancePoint2 ?? 0,
            y_normcoord_lefttop: input.yNormcoordLefttop ?? 0,
            y_normcoord_leftbottom: input.yNormcoordLeftbottom ?? 1,
            y_normcoord_righttop: input.yNormcoordRighttop ?? 0,
            y_normcoord_rightbottom: input.yNormcoordRightbottom ?? 1,
          },
        ],
      },
    ],
  };
  return { data, type: 1012, version: 5 };
};

export const getInputForUpdateWntFloorLevel = (input: WirepasFloorlevelDtos.UpdateWirepasFloorlevelDto, wirepasFloorlevelId: string) => {
  const data = {
    originator_token: uuidv4(),
    buildings: [
      {
        floor_plans: [
          {
            id: wirepasFloorlevelId,
            ...(input.name ? { name: input.name } : null),
            ...(input.level ? { level: input.level } : null),
            ...(input.distanceInM ? { distance_in_m: input.distanceInM } : null),
            ...(input.altitudeLeftbottom ? { altitude_leftbottom: input.altitudeLeftbottom } : null),
            ...(input.altitudeLefttop ? { altitude_lefttop: input.altitudeLefttop } : null),
            ...(input.altitudeRightbottom ? { altitude_rightbottom: input.altitudeRightbottom } : null),
            ...(input.altitudeRighttop ? { altitude_righttop: input.altitudeRighttop } : null),
            ...(input.latitudeLeftbottom ? { latitude_leftbottom: input.latitudeLeftbottom } : null),
            ...(input.latitudeLefttop ? { latitude_lefttop: input.latitudeLefttop } : null),
            ...(input.latitudeRightbottom ? { latitude_rightbottom: input.latitudeRightbottom } : null),
            ...(input.latitudeRighttop ? { latitude_righttop: input.latitudeRighttop } : null),
            ...(input.longitudeLeftbottom ? { longitude_leftbottom: input.longitudeLeftbottom } : null),
            ...(input.longitudeLefttop ? { longitude_lefttop: input.longitudeLefttop } : null),
            ...(input.longitudeRightbottom ? { longitude_rightbottom: input.longitudeRightbottom } : null),
            ...(input.longitudeRighttop ? { longitude_righttop: input.longitudeRighttop } : null),
            ...(input.xDistancePoint1 ? { x_distance_point1: input.xDistancePoint1 } : null),
            ...(input.xDistancePoint2 ? { x_distance_point2: input.xDistancePoint2 } : null),
            ...(input.xNormcoordLefttop ? { x_normcoord_lefttop: input.xNormcoordLefttop } : null),
            ...(input.xNormcoordLeftbottom ? { x_normcoord_leftbottom: input.xNormcoordLeftbottom } : null),
            ...(input.xNormcoordRighttop ? { x_normcoord_righttop: input.xNormcoordRighttop } : null),
            ...(input.xNormcoordRightbottom ? { x_normcoord_rightbottom: input.xNormcoordRightbottom } : null),
            ...(input.yDistancePoint1 ? { y_distance_point1: input.yDistancePoint1 } : null),
            ...(input.yDistancePoint2 ? { y_distance_point2: input.yDistancePoint2 } : null),
            ...(input.yNormcoordLefttop ? { y_normcoord_lefttop: input.yNormcoordLefttop } : null),
            ...(input.yNormcoordLeftbottom ? { y_normcoord_leftbottom: input.yNormcoordLeftbottom } : null),
            ...(input.yNormcoordRighttop ? { y_normcoord_righttop: input.yNormcoordRighttop } : null),
            ...(input.yNormcoordRightbottom ? { y_normcoord_rightbottom: input.yNormcoordRightbottom } : null),
          },
        ],
      },
    ],
  };
  return { data, type: 1013, version: 5 };
};

export const getInputForUploadImageOnWnt = (input: string) => {
  const data = {
    originator_token: uuidv4(),
    image_base64: input,
  };

  return {
    data,
    type: 1022,
    version: 5,
  };
};

export const getInputForImageUpdateWntFloorLevel = (input: UploadWntFloorlevelImageInterface, wirepasFloorlevelId: string) => {
  const data = {
    buildings: [
      {
        id: input.wirepasBuildingId,
        floor_plans: [
          {
            id: wirepasFloorlevelId,
            image_height: input.imageHeight,
            image_id: input.imageId,
            image_width: input.imageWidth,
            image_thumbnail_id: input.imageId,
          },
        ],
      },
    ],
    originator_token: uuidv4(),
  };
  return { data, type: 1013, version: 5 };
};

export const getInputForDeleteWntFloorLevel = (id: string) => {
  const data = {
    buildings: [
      {
        floor_plans: [{ id }],
      },
    ],
    originator_token: uuidv4(),
  };
  return { data, type: 1014, version: 5 };
};

export const getWntFLoorlevelByBuildingIdFormat = (id: string) => {
  const data = {
    buildings: [
      {
        id,
      },
    ],
  };
  return { data, type: 1011, version: 5 };
};
export const getWntFloorlevelImageFormate = (id: string) => {
  const data = {
    image_id: id,
  };
  return { data, type: 1021, version: 5 };
};

interface UploadWntFloorlevelImageInterface {
  imageHeight: number;
  imageId: string;
  imageWidth: number;
  wirepasBuildingId: string;
}
