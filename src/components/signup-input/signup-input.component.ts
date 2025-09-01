import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup-input',
  imports: [FormsModule],
  templateUrl: './signup-input.component.html',
  styleUrl: './signup-input.component.scss'
})
export class SignupInputComponent {
  @Input() id= '';
  @Input() name='';
  @Input() type='';
  @Input() placeholder='';
  @Input() value= ''
}
