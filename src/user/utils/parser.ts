import { v4 as uuidv4 } from "uuid";

export const wntUserFormat = (user: User, type: number) => {
  return {
    data: {
      originator_token: uuidv4(),
      users: [
        {
          full_name: user.name,
          password: user.password,
          role: user.role,
          username: user.email,
        },
      ],
    },
    type,
    version: 5,
  };
};

export const deleteWntUserFormat = (delUser: DelUser) => {
  return {
    data: {
      originator_token: uuidv4(),
      users: [
        {
          username: delUser.email,
        },
      ],
    },
    type: 14,
    version: 5,
  };
};

export const getWntUserFormat = () => {
  return {
    data: {},
    type: 11,
    version: 5,
  };
};

interface User {
  name: string;
  password: string;
  role: number;
  email: string;
}
interface DelUser {
  email: string;
}
