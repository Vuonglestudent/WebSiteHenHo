import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlMainService {

  constructor() { }

  // urlHost = "https://192.168.0.200:5000"
  urlHost = "http://localhost:5000"
}
