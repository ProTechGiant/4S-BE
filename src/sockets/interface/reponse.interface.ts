import { CoordinatesPoints } from "../../common/interfaces/point.interface";

export interface WntUserReponse {
  data: {
    role: number;
    session_id: string;
  };
  result: number;
  type: number;
  version: number;
}

export interface WntGetUsersReponse {
  data: {
    users: {
      full_name: string;
      role: number;
      username: string;
    }[];
  };
  result: number;
  type: number;
  version: number;
}

export interface WntBuildingReponse {
  data: {
    buildings: {
      id: string;
      name: string;
    }[];
  };
  result: number;
  type: number;
  version: number;
}

export interface WntFloorLevelResponse {
  data: {
    buildings: [
      {
        id: string;
        floor_plans: [
          {
            id: string;
            name: string;
            level: number;
            image_width: number | null;
            image_height: number | null;
            image_id: string | null;
            image_thumbnail_id: string | null;
            altitude_leftbottom: number | null;
            altitude_lefttop: number | null;
            altitude_rightbottom: number | null;
            altitude_righttop: number | null;
            distance_in_m: number;
            latitude_leftbottom: number | null;
            latitude_lefttop: number | null;
            latitude_rightbottom: number | null;
            latitude_righttop: number | null;
            longitude_leftbottom: number | null;
            longitude_lefttop: number | null;
            longitude_rightbottom: number | null;
            longitude_righttop: number | null;
            x_distance_point1: number;
            x_distance_point2: number;
            x_normcoord_leftbottom: number;
            x_normcoord_lefttop: number;
            x_normcoord_rightbottom: number;
            x_normcoord_righttop: number;
            y_distance_point1: number;
            y_distance_point2: number;
            y_normcoord_leftbottom: number;
            y_normcoord_lefttop: number;
            y_normcoord_rightbottom: number;
            y_normcoord_righttop: number;
            rotation_matrix: {
              m11: number | null;
              m12: number | null;
              m13: number | null;
              m21: number | null;
              m22: number | null;
              m23: number | null;
              m31: number | null;
              m32: number | null;
              m33: number | null;
            };
            offset_ecef_to_local: {
              x: number | null;
              y: number | null;
              z: number | null;
            };
            offset_local_to_ecef: {
              x: number | null;
              y: number | null;
              z: number | null;
            };
            pixels_per_meter?: number | null;
          }
        ];
      }
    ];
  };
  result: number;
  type: number;
  version: number;
}

export interface WntAreaResponse {
  data: {
    buildings: [
      {
        floor_plans: [
          {
            id: string;
            areas: [
              {
                id: string;
                name?: string;
                a?: string;
                r?: string;
                g?: string;
                b?: string;
                llas?: Array<CoordinatesPoints>;
              }
            ];
          }
        ];
      }
    ];
  };
  result: number;
  type: number;
  version: number;
}

export interface ImageResponse {
  version: number;
  type: number;
  data: ImageData;
  result: number;
}

export interface ImageData {
  update_time: number;
  image_base64: string;
}
