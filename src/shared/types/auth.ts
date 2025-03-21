export type AuthEntity = {
  id: string;
  name: string;
  iat?: number;
  exp?: number;
};

export type BasicAuthPayload = {
  username: string;
  password: string;
};
