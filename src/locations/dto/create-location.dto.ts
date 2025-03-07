import { IsEmail, IsString, Length, MinLength } from "class-validator";

export class CreateLocationDto {
	@IsString()
	@Length(2, 50)
	name: string;

	@IsString()
	@IsEmail()
	email: string;

	@IsString()
	phone: string;

	@IsString()
	@MinLength(6)
	password: string;
}
