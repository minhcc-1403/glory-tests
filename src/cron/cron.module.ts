import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { AssetsModule } from "src/assets/assets.module";
import { CronService } from "src/cron/asset-sync.service";
import { LocationsModule } from "src/locations/locations.module";

@Module({
	imports: [ScheduleModule.forRoot(), AssetsModule, LocationsModule],
	providers: [CronService],
})
export default class CronModule {}
