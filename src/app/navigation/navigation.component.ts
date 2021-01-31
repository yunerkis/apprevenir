import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, RouterEvent, Event, NavigationStart} from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public userIsAdmin = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe((routerEvent:Event)=> {
      if (routerEvent instanceof NavigationStart){
        this.userIsAdmin = routerEvent.url == "/app/admin"
      }
    })
  }

}