import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private client: HttpClient) {
  }

  login(user: { email: string; password: string }) {
    return this.client.post<{ success: boolean; data: string }>(`${environment.server}/login`, user);
  }
}
