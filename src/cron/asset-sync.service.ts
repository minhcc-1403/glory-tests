import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import axios from "axios";
import { AssetService } from "src/assets/assets.service";

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

@Injectable()
export class CronService {
  private readonly API_URL = "https://669ce22d15704bb0e304842d.mockapi.io/assets";

  constructor(
    private readonly assetService: AssetService,
  ) {}

  // Chạy cronjob lúc 00:00 mỗi ngày
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async startCronJob() {
    await this.syncAssets();
  }

  async syncAssets() {
    try {
      // Fetch API
      const response = await axios.get(this.API_URL);
      if (response.status !== 200) {
        throw new Error(`API Error: ${response.status}`);
      }

      const assets: AssetFetch[] = response.data;

      // Get valid assets
      const validAssets = assets
        .filter(asset => new Date(asset.created_at * 1000) < new Date())
        .map(item => ({
          createdAt: new Date(item.created_at * 1000),
          updatedAt: new Date(item.updated_at * 1000),
          locationCustomId: item.location_id.toString(),
          serial: item.serial,
          type: item.type,
          status: item.status,
          description: item.description,
					id: item.id
        }));

      if (!validAssets.length) return;

      // Tạo tài sản mới (có kiểm tra duplicate)
      await this.assetService.createAssetsWithTransaction(validAssets);

    } catch (error) {
			// Handle Error this here
    }
  }
}
