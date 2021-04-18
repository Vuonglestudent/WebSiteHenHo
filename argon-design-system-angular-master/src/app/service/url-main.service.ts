import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlMainService {

  constructor() { }

  urlHost = "http://hieuit.tech:5100"
  //urlHost = "https://localhost:5101"
}
