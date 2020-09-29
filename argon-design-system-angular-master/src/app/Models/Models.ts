export class User{
    Id:string;
    Email: string;
    UserName: string;
    Role: string;
    FullName: string;
    Gender: string;
    AvatarPath: string;
    Location:string;
    Status: string;
    PhoneNumber: string;
    Point:number;
    HasAvatar:boolean;
    Job: string;
}

export class Profile{
    Title: string;
    IAm: string;
    Summary: string;
    FindPeople: string;
    Weight:number;
    Height:number;
    Dob: Date;

    Marriage: string;
    Target: string;
    Education: string;
    Body: string;
    Character: string;
    LifeStyle: string;
    MostValuable: string;
    Religion: string;
    FavoriteMovie: string;
    AtmosphereLike: string;
    Smoking: string;
    DrinkBeer: string;
}

export class SocialUser{
    provider: string;  
    id: string;  
    image?: string;  
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