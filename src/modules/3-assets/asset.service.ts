import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { CreateAssetDto } from "~modules/3-assets/dto/create-asset.dto";
import { Asset, AssetDocument } from "./schemas/asset.schema";

// TASK2: IMPLEMENTATION ASSET TRANSACTION
@Injectable()
export class AssetService extends BaseService<AssetDocument> {
  private assetModel: Model<AssetDocument>;
  constructor(
    @InjectModel(Asset.name) model: Model<AssetDocument>,
    @Inject("DATABASE_CONNECTION") private readonly connection: Connection, // Inject Connection
  ) {
    super(model);
    this.assetModel = model;
  }

  async createAssetsWithTransaction(assets: CreateAssetDto[]) {
    const session = await this.connection.startSession();
    session.startTransaction(); // Start transaction

    try {
      const existingSerials = await this.assetModel
        .distinct("serial", { serial: { $in: assets.map(a => a.serial) } })
        .session(session)
        .lean()
        .exec();
      console.log({ existingSerials });
      const existingSerialSet = new Set(existingSerials);
      const newAssets = assets.filter(asset => !existingSerialSet.has(asset.serial));

      if (!newAssets.length) {
        await session.abortTransaction(); // Rollback
        return;
      }

      await this.assetModel.insertMany(newAssets, { session });
      await session.commitTransaction(); // Commit transaction
    } catch (error) {
      console.log({ error });
      await session.abortTransaction(); // Rollback
    } finally {
      await session.endSession();
    }
  }
}
