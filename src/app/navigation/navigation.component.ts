import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import {Router, ActivatedRoute, RouterEvent, Event, NavigationStart} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

interface MenuElement {
  name: string;
  children?: MenuElement[];
  icon?: string;
  route?: string
}
interface MenuNode {
  expandable: boolean;
  name: string;
  level: number;
  icon?: string;
}

const MENU_ELEMENTS : MenuElement[] = [{
  name: "Usuarios finales",
  icon: "account_box",
  children: [{
    name: "Crear usuario final",
    route: "admin"
  },
  {
    name: "Edición de usuario final",
    route: "edit-final-user"
  }
  ]
},{
  name:"Test",
  icon: "help_center",
  route: "test"
},{
  name:"Informes",
  icon: "assignment",
  route: "report"
},{
  name: "Usuarios del sistema",
  icon: "people",
  children: [{
    name: "Crear usuario",
    route: "system-user"
  },
  {
    name: "Edición de usuarios",
    route: "edit-system-user"
  }
  ]
},{
  name: "Clientes",
  icon: "person",
  children: [{
    name: "Crear cliente",
    route: "create-client"
  },
  {
    name: "Edición de clientes",
    route: "edit-client"
  }]
},{
  name:"Apprevenir.com",
  icon: "refresh",
  route: "/admin"
},]
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public userIsAdmin = false;

  private _transformer = (node: MenuElement, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      icon: node.icon,
      route: node.route
    };
  }

  treeControl = new FlatTreeControl<MenuNode>(
        node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
        this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: MenuNode) => node.expandable;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { 
    this.dataSource.data = MENU_ELEMENTS;
  }

  ngOnInit(): void {

    this.userIsAdmin = this.router.url.startsWith("/app");

    this.router.events.subscribe((routerEvent:Event)=> {
      console.log(routerEvent);
      if (routerEvent instanceof NavigationStart){
        this.userIsAdmin = routerEvent.url.startsWith("/app");
      }
    })
  }

  logout() {
    
    this.authService.logout();
  }

}