import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this._authService.user.subscribe(
      (res) => {
        res ? (this.isLoggedIn = true) : (this.isLoggedIn = false);
      }
      // err => {
      //   console.log(err);
      //   this.isLoggedIn = false;
      // }
    );
  }

  onsignOut() {
    this._authService.signOut();
  }
}
