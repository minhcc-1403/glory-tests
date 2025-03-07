import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import axios from "axios";
import { LocationService } from "~modules/2-locations/location.service";
import { AssetService } from "~modules/3-assets/asset.service";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";

export interface AssetFetch {
  type: string;
  serial: string;
  status: string;
  description: string;
  created_at: number;
  updated_at: number;
  location_id: number;
  id: string;
}

const convertDateNumToMS = (dateNum: number) => new Date(dateNum * 1000);

// TODO: IMPLEMENTATION TEST
@Injectable()
export class CronService {
  private readonly API_URL = "https://669ce22d15704bb0e304842d.mockapi.io/assets";
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly locationService: LocationService,
    private readonly assetService: AssetService,
  ) {}

  // It will sync once a day at 00:00
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async startCronJob() {
    await this.syncAssets();
  }

  async getDataSync() {
    try {
      const response = await axios.get(this.API_URL);

      // Check if the request was successful
      if (response.status !== 200) this.logger.writeLog(response, "CronService.getDataSync");

      const { data: assets }: { data: AssetFetch[] } = response;

      return assets;
    } catch (error) {
      this.logger.writeLog(error, "CronService.getDataSync");
    }
  }

  async syncAssets() {
    try {
      const assets = await this.getDataSync();

      const activeLocationIds: string[] = await this.locationService.distinct("customId", {
        status: "active",
      });

      const validAssets = assets.filter(
        asset =>
          activeLocationIds.includes(asset.location_id.toString()) &&
          new Date(convertDateNumToMS(asset.created_at)) < new Date(),
      );

      // No new assets to sync.
      if (validAssets.length === 0) return;

      try {
        // Create assets
        await this.assetService.createAssetsWithTransaction(
          validAssets.map(item => ({
            createdAt: new Date(convertDateNumToMS(item.created_at)),
            locationCustomId: item.location_id.toString(),
            serial: item.serial,
            updatedAt: new Date(convertDateNumToMS(item.updated_at)),
            description: item.description,
          })),
        );
      } catch (error) {
        this.logger.writeLog(error, "CronService.syncAssets");
      }
    } catch (error) {
      this.logger.writeLog(error, "CronService.syncAssets");
    }
  }
}
