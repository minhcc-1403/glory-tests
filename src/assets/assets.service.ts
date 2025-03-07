import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Asset } from "src/assets/entities/asset.entity";
import { Repository } from "typeorm";

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async createAssetsWithTransaction(assets: Asset[]) {
    return this.assetRepository.manager.transaction(async (transactionalEntityManager) => {

			const existingSerials = await transactionalEntityManager
        .createQueryBuilder(Asset, "asset")
        .select("asset.serial")
        .where("asset.serial IN (:...serials)", { serials: assets.map(a => a.serial) })
        .getMany();

      const existingSerialSet = new Set(existingSerials.map(a => a.serial));

      const newAssets = assets.filter(asset => !existingSerialSet.has(asset.serial));

      if (!newAssets.length) return;

      await transactionalEntityManager.save(Asset, newAssets);
    });
  }

  async getExistingSerials(serials: string[]): Promise<string[]> {
    const existingAssets = await this.assetRepository
      .createQueryBuilder("asset")
      .select("asset.serial")
      .where("asset.serial IN (:...serials)", { serials })
      .getMany();

    return existingAssets.map(a => a.serial);
  }
}
