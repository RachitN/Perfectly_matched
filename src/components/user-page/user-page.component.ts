import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { UserProfileComponent } from '../user-profile/user-profile.component';

@Component({
  selector: 'app-user-page',
  imports: [FontAwesomeModule, UserProfileComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent {
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft
}
