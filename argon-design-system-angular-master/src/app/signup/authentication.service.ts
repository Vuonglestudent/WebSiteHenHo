import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{SocialUser} from '../Models/Models'
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http:HttpClient
  ) { }

  private mainUrl = "http://localhost:5000/api/Authenticates";

  public SignUp = (fullName:string, userName:string, email:string, password:string) => {
    
    var data = new FormData();
    data.append("Email", email);
    data.append("UserName", userName);
    data.append("Password", password);
    data.append("FullName", fullName);

    var path = `/signUp`;

    return this.http.post<any>(this.mainUrl + path, data).toPromise();
  }

  public Login = (email:string, password:string) =>{
    var data = new FormData();
    data.append("Email", email);
    data.append("Password", password);

    var path = `/login`;

    return this.http.post<any>(this.mainUrl + path, data).toPromise();
  }

  public ForgotPasswordRequest = (email: string) =>{
    var data = new FormData();
    data.append("Email", email);

    var path = '/forgotPassword';

    return this.http.post<any>(this.mainUrl + path, data).toPromise();
  }

  public CodeValidation = (code: string, email:string, newPassword:string) =>{
    var data = new FormData();
    data.append("Email", email);
    data.append("Code", code);
    data.append("NewPassword", newPassword);

    var path = '/CodeValidation';

    return this.http.post<any>(this.mainUrl + path, data).toPromise();
  }

  public FacebookLogin = (facebookAccount: SocialUser) =>{
    var path = '/facebook';
    var str = facebookAccount.photoUrl; 
  
    var re = /normal/gi;  
  
    // Use of String replace() Method 
    var newstr = str.replace(re, "large");    
    var data = new FormData();
    data.append("Email", facebookAccount.email);
    data.append("FullName", facebookAccount.name);
    data.append("Avatar", str);

    return this.http.post<any>(this.mainUrl + path, data).toPromise();
  }
}
