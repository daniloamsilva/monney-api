export type LoginResponseDto = {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
  };
};
