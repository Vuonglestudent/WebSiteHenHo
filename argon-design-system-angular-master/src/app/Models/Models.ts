export class Profile {
    title: string;
    findPeople: string;
    weight: number;
    height: number;
    dob: Date;
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
    followed: boolean;
    favorited: boolean;
    isInfoUpdated: number;
    token?: any;
    profile: Profile;
}

export class SocialUser{
    provider: string;  
    id: string;  
    photoUrl: string;
    email: string;  
    name: string;  
    token?: string;  
    idToken?: string;  
}
export class Message{
    Id: number;
    SenderId: string;
    ReceiverId: string;
    Content : string;
    SentAt : Date;
    Type: string;
}