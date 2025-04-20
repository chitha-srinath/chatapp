import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateChatDto {
  @IsString()
  createdBy: string;
  @IsArray()
  participants: string[]; // Array of user IDs
  @IsString()
  @IsOptional()
  groupName?: string;
  @IsBoolean()
  isGroup: boolean;
}

//  chatId: string;

//   conversationUsers: ConversationUser[];

//   lastMsgInfo: Types.ObjectId;

//   // isReceiverOnline: boolean;

//   notificationCount: number;

//   // Group chat properties
//   groupName?: string;

//   isGroup: boolean;

//   membersOnline?: number;

// ConversationUser Schema:

//   userId: Types.ObjectId;

//   username: string;

//   userPic: string;

// isOnline: boolean;
