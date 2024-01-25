import { BadGatewayException } from "../../errors/exceptions";
import { v4 as uuidv4 } from "uuid";

const isValidUpdateInput = (input: InputType): boolean => {
  return !!input.name && !!input.id;
};

const isValidCreateInput = (input: InputType): boolean => {
  return !!input.name;
};

const isValidDeleteInput = (input: InputType): boolean => {
  return !!input.id;
};

export const getWntBuildingFormat = (input: InputType, state: WntActionState) => {
  if ((state === WntActionState.CREATE && !isValidCreateInput(input)) || (state === WntActionState.UPDATE && !isValidUpdateInput(input)) || (state === WntActionState.DELETE && !isValidDeleteInput(input))) {
    throw new BadGatewayException("Invalid input for the given action state.");
  }

  const data = {
    buildings: [input],
    originator_token: uuidv4(),
  };

  return { data, type: state, version: 5 };
};

export const getWntGetBuildingFormat = () => {
  return { data: {}, type: 1001, version: 5 };
};

interface InputType {
  name?: string;
  id?: string;
}

export enum WntActionState {
  CREATE = 1002,
  UPDATE = 1003,
  DELETE = 1004,
}
