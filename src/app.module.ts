import { Module } from "@nestjs/common";
import { AssetsModule } from "src/assets/assets.module";
import CronModule from "src/cron/cron.module";
import { LocationsModule } from "src/locations/locations.module";
import { OrganizationsModule } from "src/organizations/organizations.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CommonModule } from "./common/common.module";
import { DatabaseModule } from "./database/database.module";
import { UsersModule } from "./users/users.module";

@Module({
	imports: [
		UsersModule,
		CommonModule,
		DatabaseModule,
		LocationsModule,
		AssetsModule,
		OrganizationsModule,
		CronModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
