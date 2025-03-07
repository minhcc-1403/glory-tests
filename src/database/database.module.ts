import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: "postgres", // hoặc 'mysql'
			host: "localhost",
			port: 5432,
			username: "user",
			password: "password",
			database: "mydatabase",
			autoLoadEntities: true,
		}),
	],
})
export class DatabaseModule {}
