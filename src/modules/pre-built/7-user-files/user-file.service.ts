import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { CloudinaryService } from "~shared/storage/cloudinary/cloudinary.service";
import { LocalService } from "~shared/storage/local-storage/local.service";
import { S3Service } from "~shared/storage/s3/s3.service";
import { UploadType } from "~types/upload-type";
import { StorageLocationEnum } from "../7-uploads/enum/store-location.enum";
import { FileUploaded } from "../7-uploads/types/upload.result.type";
import { UserFile, UserFileDocument } from "./schemas/user-file.schema";

@Injectable()
export class UserFileService extends BaseService<UserFileDocument> {
  private userFileService: UserFileService;

  constructor(
    @InjectModel(UserFile.name) model: Model<UserFileDocument>,
    private readonly localService: LocalService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly s3Service: S3Service,
  ) {
    super(model);

    this.userFileService = this;
  }

  @OnEvent("file.uploaded")
  createUserFile(files: FileUploaded[], userId: ObjectId) {
    return this.userFileService.createMany(files.map(item => ({ ...item, userId })));
  }

  @OnEvent("file.delete.url")
  async deleteByUrl(url: string) {
    const file = await this.userFileService.deleteOne({ url });

    if (file) await this.deleteFiles([file]);

    return file;
  }

  @OnEvent("file.delete.urls")
  async deleteByUrls(urls: string[]) {
    const files = await this.userFileService.findMany({ url: { $in: urls } });

    if (files?.length) await this.deleteFiles(files);

    return this.userFileService.deleteMany({ url: { $in: urls } });
  }

  @OnEvent("file.delete.files")
  async deleteFiles(
    inputs: {
      storageLocation: StorageLocationEnum;
      resourceKeys: string[];
      resourceType: UploadType;
    }[],
  ) {
    const resourceKeysLocal: string[] = [];
    const resourceKeysS3: string[] = [];
    const resourceKeysCloudinary: {
      resourceKey: string;
      fileType: UploadType;
    }[] = [];

    for (const file of inputs) {
      switch (file.storageLocation) {
        case StorageLocationEnum.Local:
          resourceKeysLocal.push(...file.resourceKeys);
          break;

        case StorageLocationEnum.S3:
          resourceKeysS3.push(...file.resourceKeys);
          break;

        case StorageLocationEnum.Cloudinary:
          resourceKeysCloudinary.push(
            ...file.resourceKeys.map(resourceKey => ({
              resourceKey,
              fileType: file.resourceType,
            })),
          );
          break;
      }
    }

    try {
      if (resourceKeysLocal.length > 0) {
        await this.localService.deleteManyByKeys(resourceKeysLocal);
      }

      if (resourceKeysS3.length > 0) {
        await this.s3Service.deleteManyByKeys(resourceKeysS3);
      }

      if (resourceKeysCloudinary.length > 0) {
        await this.cloudinaryService.deleteManyByKeys(resourceKeysCloudinary);
      }
    } catch (error) {
      // TODO: Handle error
    }
  }
}
