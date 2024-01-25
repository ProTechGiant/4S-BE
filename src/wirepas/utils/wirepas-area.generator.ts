import { AreaDtos } from "../../area/dto/area.dto";
import { Area } from "../../area/entity/area.entity";
import { WirepasAreaDtos } from "../dto/wirepas-area.dto";
import { v4 as uuidv4 } from "uuid";

export const getWirepasAreaFormat = (input: AreaDtos.CreateAreaInputData, state: WntActionState) => {
  const data = {
    buildings: [
      {
        floor_plans: [
          {
            id: input.wirepasFloorlevelId,
            areas: [
              {
                a: input.a,
                b: input.b,
                g: input.g,
                r: input.r,
                name: input.description,
                llas: [...input.coordinates],
              },
            ],
          },
        ],
      },
    ],
    originator_token: uuidv4(),
  };

  return { data, type: state, version: 5 };
};
export const getWirepasAreaFormatForUpdate = (area: Area, state: WntActionState, id: string, floorlevelId: string) => {
  const data = {
    originator_token: uuidv4(),
    buildings: [
      {
        floor_plans: [
          {
            id: floorlevelId,
            areas: [
              {
                id: id,
                a: area.a,
                b: area.b,
                g: area.g,
                r: area.r,
                name: area.description ?? "Area description",
                llas: [...area.coordinates],
              },
            ],
          },
        ],
      },
    ],
  };

  return { data, type: state, version: 5 };
};
export const getWirepasAreaFormatForDelete = (id: string, wirepasFloorlevelId: string, state: WntActionState) => {
  const data = {
    buildings: [{ floor_plans: [{ id: wirepasFloorlevelId, areas: [{ id }] }] }],
    originator_token: uuidv4(),
  };

  return { data, type: state, version: 5 };
};

export const getWirepasAreaFormatForGet = (floorlevelId: string) => {
  const data = {
    buildings: [
      {
        floor_plans: [
          {
            id: floorlevelId,
          },
        ],
      },
    ],
  };

  return { data, type: 1031, version: 5 };
};

export interface CreateWNTAreaInterface {
  wirepasFloorlevelId: string;
  wntArea: WNTArea;
}

interface WNTArea {
  r: string;
  g: string;
  b: string;
  a: string;
  name: string;
  llas: WirepasAreaDtos.PolygonLatLongDto[];
}

interface DeleteInputType {
  gatewayFloorId: string;
  gatewayAreaId: string;
}

export enum WntActionState {
  AREA_CREATE = 1032,
  AREA_DELETE = 1034,
  AREA_UPDATE = 1033,
}
