import { Component } from '@angular/core';
import { IUser } from '../interfaces/user.interface';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  state: IUser | null = null;

  constructor(private router: Router, private authService: AuthService) {
    authService.state$.subscribe(state => {
      this.state = state;

      if (state) {
        if (this.router.url === '/login') {
          this.router.navigate(['']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.authService.clear();
  }
}
