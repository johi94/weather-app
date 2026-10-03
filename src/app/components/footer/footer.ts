import { Component } from '@angular/core';
import { APP_NAME } from '../../app-name';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly year = new Date().getFullYear();
  protected readonly appName = APP_NAME;
}
