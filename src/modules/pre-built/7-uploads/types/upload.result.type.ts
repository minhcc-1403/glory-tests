import { ResourceTypeEnum } from "../enum/resource-type.enum";
import { StorageLocationEnum } from "../enum/store-location.enum";

export type FileUploaded = {
  url: string;
  urlXSmall?: string;
  urlSmall?: string;
  urlMedium?: string;
  urlLarge?: string;
  urlXLarge?: string;

  fileFolder: string;
  fileSize: number;
  resourceKeys: string[];
  fileName: string;
  fileType: string;
  resourceType: ResourceTypeEnum;
  originalname: string;
  storageLocation: StorageLocationEnum;
};
