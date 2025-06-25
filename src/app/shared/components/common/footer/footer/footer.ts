import { currYear } from '@/utils/date.utils';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  public currYear: number = currYear;

}
