export class LoginResponseDto {
  statusCode: number;
  message: string;
  data: {
    accessToken: {
      sub: string;
      email: string;
      exp: number;
      iat: number;
    };
  };
}
