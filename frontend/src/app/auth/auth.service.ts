import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { IUser } from '../interfaces/user.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  state$: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);

  constructor() {
    if (this.isAuthorized()) {
      const token = this.getToken();
      this.broadcastAuthState(token);
    }
  }

  isAuthorized: () => boolean = () => {
    const token = this.getToken();
    return !!token;
  };

  getToken(): string {
    return localStorage.getItem('token') as string;
  };

  setToken = (token: string) => {
    localStorage.setItem('token', token);
    this.broadcastAuthState(token);
  };

  clear() {
    localStorage.clear();
    this.state$.next(null);
  }

  private broadcastAuthState = (token: string) => {
    const {id, email, fullname} = jwt_decode(token) as IUser;

    this.state$.next({id, email, fullname});
  };
}
