import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  chatId: string;
  @ApiProperty()
  @IsString()
  senderId: string;
  @ApiProperty()
  @IsString()
  content: string;
  @ApiProperty()
  @IsOptional()
  attachment?: fileInfo[];
}

export class fileInfo {
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl: string;
  isImage: boolean;
  isVideo: boolean;
  isAudio: boolean;
  isDocument: boolean;
}
