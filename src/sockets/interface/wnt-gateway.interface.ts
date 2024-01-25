export interface AuthenticationResponse {
  type: string;
  utf8Data: string;
}

export interface ParsedAuthenticationResponse {
  version: number;
  data: {
    role: number;
    session_id: string;
  };
  result: number;
  type: number;
}
export interface WntAuthenticationInput {
  email: string;
  password: string;
}
