import { IsOptional, IsString } from "class-validator";

export class CreateAssetDto {
  @IsString()
  serial: string;

  @IsString()
  locationCustomId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;
}
