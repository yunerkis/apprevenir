import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import {Router, ActivatedRoute, RouterEvent, Event, NavigationStart} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { getStoredProfileInfo } from "../services/auth/authStore";

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
    route: "admin-edit-final-user"
  }
  ]
},{
  name:"Test",
  icon: "help_center",
  route: "admin-test"
},{
  name:"Informes",
  icon: "assignment",
  route: "admin-report"
},{
  name: "Usuarios del sistema",
  icon: "people",
  children: [{
    name: "Crear usuario",
    route: "admin-system-user"
  },
  {
    name: "Edición de usuarios",
    route: "admin-edit-system-user"
  }
  ]
},{
  name: "Clientes",
  icon: "person",
  children: [{
    name: "Crear cliente",
    route: "admin-create-client"
  },
  {
    name: "Edición de clientes",
    route: "admin-edit-client"
  }]
},{
  name:"Apprevenir.com",
  icon: "refresh"
},]
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public userIsAdmin = false;
  public userName = "Nombre de usuario";

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
    const profile = getStoredProfileInfo();
    this.userName = `${profile.firstNames} ${profile.lastNames}`;
    this.userIsAdmin = this.router.url.startsWith("/app/admin");

    this.router.events.subscribe((routerEvent:Event)=> {
      if (routerEvent instanceof NavigationStart){
        this.userIsAdmin = routerEvent.url.startsWith("/app/admin");
      }
    })
  }

  logout() {
    
    this.authService.logout();
  }

}