import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
   
  constructor(private loginService:LoginService ){

  }

  email:any;
  password:any;

  loginUser(){
    this.loginService.loginUser({email:this.email, password:this.password}).subscribe({
      next:(response:any)=>{
        console.log(response)
      }
    })
  }
}
