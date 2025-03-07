import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { OrganizationModule } from "~modules/1-organizations/organization.module";
import { LocationModule } from "~modules/2-locations/location.module";
import { AssetModule } from "~modules/3-assets/asset.module";
import { CronService } from "./cron.service";

@Module({
  imports: [ScheduleModule.forRoot(), OrganizationModule, AssetModule, LocationModule],
  providers: [CronService],
})
export default class CronModule {}
