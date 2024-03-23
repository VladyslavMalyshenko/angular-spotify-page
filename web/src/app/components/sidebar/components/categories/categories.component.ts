import { Component } from '@angular/core';
import { RouterService } from '../../../../services/router.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  constructor(public routerService: RouterService) {}
}
