export class Profile {
    title: string;
    findPeople: string;
    weight: number;
    height: number;
    dob: String;
    age: number;
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

    shopping: string;
    travel: string;
    game: string;
    cook: string;
    likeTechnology: string;
    likePet: string;
    playSport: string;
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
    numberOfFollowers: number;
    numberOfFavoritors: number;
    numberOfImages: number;
    followed: boolean;
    favorited: boolean;
    blocked: boolean;
    isInfoUpdated: boolean;
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
    point: number;
    status: string;
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
    onlineCount:number;
}

export class ChatFriend {
    user: UserDisplay;
    messages: Message[];
    pageIndex: number;
}

export class ProfileData {
    findPeople: string[];
    atmosphereLike: string[];
    body: string[];
    character: string[];
    drinkBeer: string[];
    education: string[];
    favoriteMovie: string[];
    gender: string[];
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
    
    cook: string[];
    likeTechnology: string[];
    likePet: string[];
    playSport: string[];
    travel: string[];
    game: string[];
    shopping: string[];
    ageGroup: string[];
}

export class Image{
    id: number;
    userId:string;
    title: string;
    numberOfLikes:number;
    liked:boolean;
    imagePath:string;
    hasImage: boolean;
    createdAt: string;
}

export class ImageUser {
    id: string;
    images: Image[];
}