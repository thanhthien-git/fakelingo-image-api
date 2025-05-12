// cloudinary.service.ts

import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './types/cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  private async uploadFile(
    file: Express.Multer.File,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  private async uploadFiles(
    files: Express.Multer.File[],
  ): Promise<CloudinaryResponse[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadFile(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async uploadAndGetUrls(files: Express.Multer.File[]): Promise<string[]> {
    const results = await this.uploadFiles(files);
    return results.map((result) => result.secure_url);
  }
}
