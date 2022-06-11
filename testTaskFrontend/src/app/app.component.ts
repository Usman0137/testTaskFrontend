import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Test Task';

  constructor(public router: Router, private _authService: AuthService) {}
  ngOnInit(): void {
    this._authService.autoSignIn();
  }
}
