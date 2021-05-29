import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlMainService {

  constructor() { }

  //urlHost = "https://hieuit.tech:5201"
  urlHost = environment.baseUrl;
}