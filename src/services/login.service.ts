import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://127.0.0.1:8000/api/login'

  loginUser(body:any){
    return this.http.post(this.apiUrl,body)
  }
}
