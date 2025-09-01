import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "../components/home/home.component";
import { LoginComponent } from "../components/login/login.component";
import { SignupComponent } from "../components/signup/signup.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserPageComponent } from '../components/user-page/user-page.component';
import { HeaderComponent } from '../components/header/header.component';
import { MessageComponent } from '../components/message/message.component';

@Component({
  selector: 'app-root',
  imports: [SignupComponent,CommonModule, FormsModule, UserPageComponent, HeaderComponent, MessageComponent, LoginComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'perfectly_matched';
}
