import { Component } from '@angular/core';
import {Router, ActivatedRoute, RouterEvent, Event, NavigationStart} from '@angular/router';

const PROTECTED_ROUTES = ["/admin"];
@Component({
  selector: 'app-root',
  templateUrl: `./app.html`
})

export class AppComponent {

  public needsNavigationChrome = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe((routerEvent:Event)=> {
      if (routerEvent instanceof NavigationStart){
        this.needsNavigationChrome = PROTECTED_ROUTES.indexOf(routerEvent.url) != -1;
      }
    })
  }

}
