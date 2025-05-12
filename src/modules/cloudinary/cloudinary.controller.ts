import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('image')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
    return this.cloudinaryService.uploadAndGetUrls(files);
  }
}