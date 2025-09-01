import { Component } from '@angular/core';
import { MessageWindowComponent } from "../message-window/message-window.component";

@Component({
  selector: 'app-message',
  imports: [MessageWindowComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

}
