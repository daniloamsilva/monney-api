export class LoginResponseDto {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
  };
}
