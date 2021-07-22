import { BehaviorSubject, Observable } from "rxjs";
import { CallType } from "../shared/service/signal-r.service";

export class SocialUser {
  provider: string;
  id: string;
  photoUrl: string;
  email: string;
  name: string;
  token?: string;
  idToken?: string;
}

export class UserDisplay {
  id: string;
  fullName: string;
  dob: Date;
  createdAt: Date;
  avatarPath: string;
  summary: string;
  numberOfFollowers: number;
  followed: boolean;
  numberOfFavoritors: number;
  favorited: boolean;
  numberOfImages: number;
  point: number;
  status: string;
  distance: number;
}

export class Message {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: Date;
  type: string;
  hasAvatar: boolean;
  avatar: string;
  fullName: string;
  onlineCount: number;
  //
  fromId: string;
  toId: string;
  createdAt: string;
  messageType: string;
  filePath: string;
  filePaths: string[];
}

export class ChatFriend {
  user: UserDisplay;
  messages: Message[];
  pageIndex: number;
  isClicked: boolean;
}

export class FeatureDetail {
  id: number;
  content: string;
  weight: number;
  featureId: number;
}

export class Feature {
  id: number;
  name: string;
  weightRate: number;
  isCalculated: boolean;
  isSearchFeature: boolean;
  featureDetails: FeatureDetail[];
}

export class ProfileData {
  findPeople: string[];
  job: string[];
  location: string[];
  ageGroup: string[];
  features: Feature[];
  genders: string[] = ["Nam", "Nữ"];
}

export class Image {
  id: number;
  userId: string;
  title: string;
  numberOfLikes: number;
  liked: boolean;
  imagePath: string;
  hasImage: boolean;
  createdAt: string;
}

export class ImageUser {
  id: string;
  images: Image[];
}

export class FeatureVM {
  featureId: number;
  featureDetailId: number;
  name: string;
  content: string;
  updateFeatureId: number;
  isSearchFeature: boolean;
  featureDetails: FeatureDetail[];
}

export class User {
  id: string;
  role: string;
  userName: string;
  fullName: string;
  gender: string;
  avatarPath: string;
  status: string;
  email: string;
  phoneNumber: string;
  point: number;
  hasAvatar: boolean;
  summary: string;
  numberOfFollowers: number;
  numberOfFavoritors: number;
  numberOfImages: number;
  followed: boolean;
  favorited: boolean;
  blocked: boolean;
  age: number;
  isInfoUpdated: boolean;
  token: string;
  title: string;
  weight: number;
  height: number;
  dob: string;
  job: string;
  location: string;
  findPeople: string;
  findAgeGroup: string;
  features: FeatureVM[];
  searchFeatures: FeatureVM[];

  relationship: IRelationship;
  images: Image[];
}

export class ImageScore {
  active: boolean;
  autoFilter: boolean;
  drawings: number;
  hentai: number;
  neutral: number;
  porn: number;
  sexy: number;
  updatedAt: Date;
}

export class News {
  id: number;
  userId: string;
  fullName: string;
  avatarPath: string;
  hasAvatar: boolean;
  followed: boolean;
  location: string;
  title: string;
  numberOfLikes: number;
  liked: boolean;
  imagePath: string;
  hasImage: boolean;
  createdAt: string;
}

export interface IUser {
  userId: string;
  connectionId: string;
  userName: string;
  callType: CallType;
  avatarPath: string;
}

export enum SignalType {
  iceCandidate,
  Offer,
  Answer,
  HangUp,
}

export interface IUserInfo {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isInfoUpdated: boolean;
  avatarPath: string;
  token: string;
}

export interface INotification {
  id: number;
  fullName: string;
  fromId: string;
  toId: string;
  type: string;
  createdAt: Date;
}

export interface IRelationship {
  id: number;
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  fromAvatar: string;
  toAvatar: string;
  createdAt: Date;
  updatedAt: Date;
  relationshipType: RelationshipType;
}

export enum RelationshipType {
  Không_có_gì,
  Đang_tìm_hiểu,
  Đang_yêu,
  Đã_kết_hôn,
}

export interface IFeedback {
  id: number;
  userId: string;
  userName: string;
  avatar: string;
  title: string;
  content: string;
  vote: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFindAround {
  pageIndex: number;
  pageSize: number;
  userId: string;
  distance: number;
  gender: number;
  ageGroup: number;
}
