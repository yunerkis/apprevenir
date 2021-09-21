import { FlatTreeControl } from '@angular/cdk/tree';
import { environment } from '@environments/environment';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { EventBus } from '@services/messaging/EventBus';
import { KnownMessageKeys } from '@services/messaging/EventMessage';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import {
  getStoredProfileInfo,
  IProfileInfo,
  ProfileChangedMessage,
} from '../services/auth/authStore';

interface MenuElement {
  name: string;
  children?: MenuElement[];
  icon?: string;
  route?: string;
}
interface MenuNode {
  expandable: boolean;
  name: string;
  level: number;
  icon?: string;
}

const ROOT_MENU_ELEMENTS: MenuElement[] = [
  {
    name: 'Usuarios finales',
    icon: 'account_box',
    children: [
      {
        name: 'Crear usuario final',
        route: 'admin',
      },
      {
        name: 'Edición de usuario final',
        route: 'admin/edit-final-user',
      },
    ],
  },
  {
    name: 'Test informe',
    icon: 'content_paste',
    route: 'admin/report',
  },
  {
    name: 'Usuarios del sistema',
    icon: 'people',
    children: [
      {
        name: 'Crear usuario',
        route: 'admin/system-user',
      },
      {
        name: 'Edición de usuarios',
        route: 'admin/edit-system-user',
      },
    ],
  },
  {
    name: 'Clientes',
    icon: 'perm_identity',
    children: [
      {
        name: 'Crear cliente',
        route: 'admin/clients/new',
      },
      {
        name: 'Edición de clientes',
        route: 'admin/clients',
      },
    ],
  },
  {
    name: 'Hacer test',
    icon: 'live_help',
  },
];

const ADMIN_MENU_ELEMENTS: MenuElement[] = [
  {
    name: 'Usuarios finales',
    icon: 'account_box',
    children: [
      {
        name: 'Crear usuario final',
        route: 'admin',
      },
      {
        name: 'Edición de usuario final',
        route: 'admin/edit-final-user',
      },
    ],
  },
  {
    name: 'Test informe',
    icon: 'content_paste',
    route: 'admin/report',
  },
  {
    name: 'Hacer test',
    icon: 'live_help',
  },
];

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  public userIsAdmin = false;
  public userName = 'Nombre de usuario';
  public logoOverride = null;
  public role = getStoredProfileInfo().role;
  public config = getStoredProfileInfo().clientConfig;
  public lastNames = '';
  public imagesBaseUrl = `${environment.url}/storage/images`;

  private _transformer = (node: MenuElement, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      icon: node.icon,
      route: node.route,
    };
  };

  treeControl = new FlatTreeControl<MenuNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: MenuNode) => node.expandable;

  constructor(private authService: AuthService) {
    this.dataSource.data = this.role === 'root' ? ROOT_MENU_ELEMENTS : ADMIN_MENU_ELEMENTS;
    this.updateProfileData = this.updateProfileData.bind(this);
  }

  profileSubscription: Subscription | null;

  ngOnInit(): void {
    this.updateProfileData(getStoredProfileInfo());

    this.profileSubscription = EventBus.instance
      .messages<ProfileChangedMessage>(KnownMessageKeys.ProfileChanged)
      .subscribe((profileMessage) => {
        this.updateProfileData(profileMessage.payload);
      });
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  private updateProfileData(profile: IProfileInfo) {
    if (!profile) {
      this.userIsAdmin = false;
      this.userName = "Nombre de usuario";
      this.logoOverride = null;
      return;
    }

    const name = [
      profile.firstNames,
      profile.lastNames,
      profile.lastNamesTwo
    ].filter(nameFragment => !!nameFragment).join(" ");

    this.userIsAdmin = profile.isAdmin;
    this.userName = name;
    this.logoOverride = profile.image;;
  }

  logout() {
    this.authService.logout();
  }
}
