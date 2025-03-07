import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: "postgres",
	port: 5432,
	username: "myuser",
	password: "mypassword",
	database: "mydatabase",
	entities: [__dirname + "/../**/*.entity.{ts,js}"],
	migrations: [__dirname + "/migrations/*.{ts,js}"],
	synchronize: false,
	logging: true,
});
export default AppDataSource;
