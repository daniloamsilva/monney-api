import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNameRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
