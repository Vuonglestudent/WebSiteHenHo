export class Profile {
    title: string;
    findPeople: string;
    weight: number;
    height: number;
    dob: String;
    age: number;
    iAm: string;
    job: string;
    location: string;
    marriage: string;
    target: string;
    education: string;
    body: string;
    character: string;
    lifeStyle: string;
    mostValuable: string;
    religion: string;
    favoriteMovie: string;
    atmosphereLike: string;
    smoking: string;
    drinkBeer: string;
}

export class User {
    id: string;
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
    numberOfFollowing: number;
    numberOfFollowers: number;
    numberOfFavoriting: number;
    numberOfFavoritors: number;
    numberOfImages: number;
    followed: boolean;
    favorited: boolean;
    blocked: boolean;
    isInfoUpdated: number;
    token?: any;
    profile: Profile;
}

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
    hasAvatar: boolean;
    summary: string;
    numberOfFollowers: number;
    followed: boolean;
    numberOfFavoritors: number;
    favorited: boolean;
    numberOfImages: number;
}

export class Message {
    id: number;
    senderId: string;
    receiverId: string;
    content: string;
    sentAt: Date;
    type: string;
}

export class ChatFriend {
    user: UserDisplay;
    messages: Message[];
}

export class ProfileData {
    atmosphereLike: string[];
    body: string[];
    character: string[];
    drinkBeer: string[];
    education: string[];
    favoriteMovie: string[];
    gender: string[];
    iAm: string[];
    job: string[];
    lifeStyle: string[];
    location: string[];
    marriage: string[];
    mostValuable: string[];
    operationType: string[];
    religion: string[];
    smoking: string[];
    target: string[];
    typeAccount: string[];
    userStatus: string[];
}

export class Image{
    id: string;
    userId:string;
    title: string;
    numberOfLikes:number;
    imagePath:string;
    hasImage: boolean;
    createdAt: string;
}