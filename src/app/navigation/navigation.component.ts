import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import {Router, ActivatedRoute, RouterEvent, Event, NavigationStart} from '@angular/router';
interface MenuElement {
  name: string;
  children?: MenuElement[];
  icon?: string;
}
interface MenuNode {
  expandable: boolean;
  name: string;
  level: number;
  icon?: string;
}

const MENU_ELEMENTS : MenuElement[] = [{
  name: "Usuarios del sistema",
  icon: "help_center",
  children: [{
    name: "Crear usuario"
  },
  {
    name: "Edición de usuarios"
  }
  ]
},{
  name: "Clientes",
  icon: "help_center",
  children: [{
    name: "Crear cliente"
  },
  {
    name: "Edición de clientes"
  }]
}]
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
      icon: node.icon
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
  ) { 
    this.dataSource.data = MENU_ELEMENTS;
  }

  ngOnInit(): void {
    this.userIsAdmin = this.router.url == "/app/admin";
    this.router.events.subscribe((routerEvent:Event)=> {
      if (routerEvent instanceof NavigationStart){
        this.userIsAdmin = routerEvent.url == "/app/admin"
      }
    })
  }

}