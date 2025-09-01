import { Component } from '@angular/core';
import { SignupInputComponent } from "../signup-input/signup-input.component";
import * as fields from './../../data/field'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [SignupInputComponent, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  field: any;
  fieldNo: any = 0
  constructor() {
    this.field = fields.fields[this.fieldNo]
  }

  next(event: any) {
    event.preventDefault();
    if (this.fieldNo < 9) {
      this.fieldNo += 1
      this.field = fields.fields[this.fieldNo]
    }
    else{

    }
  }
}
