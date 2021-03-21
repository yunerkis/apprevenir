import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { deleteUser, getEndUsers } from '@services/user/usersDataSource';
import { User } from '@typedefs/backend';
import { LoaderComponent } from 'src/app/core/loader/loader.component';
import Swal from "sweetalert2";

type UserRow = {
  userId: number;
  firstNames: string;
  lastNames: string;
  email: string,
  statusLabel: string;
}
type UserTableColumnLabels = keyof UserRow | "actions";

@Component({
  selector: 'app-edit-final-user',
  templateUrl: './edit-final-user.component.html',
  styleUrls: ['./edit-final-user.component.scss']
})
export class EditFinalUserComponent implements AfterViewInit {
  public resultsLength = 0;
  public displayedColumns: UserTableColumnLabels[] = [
    'userId', 
    'firstNames', 
    'lastNames', 
    'email', 
    'statusLabel', 
    'actions'
  ];

  public dataSource = new MatTableDataSource<UserRow>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(LoaderComponent) loader: LoaderComponent;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    this.dataSource.filterPredicate = this.filterUsers;
  }

  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    await this.loader.showLoadingIndicator(async () => {
      await this.reloadUsers();
    });
  }

  async reloadUsers() {
    const users = await getEndUsers();
    
    const userRows: UserRow[] = users.map(user => ({
      userId: user.id,
      firstNames: user.profile.first_names,
      lastNames: user.profile.last_names,
      email: user.email,
      statusLabel: user.status == 1 ? "Activo" : "Inactivo"
    }));

    this.dataSource.data = userRows;
    this.resultsLength = userRows.length;
  }

  onEditRequested(userId: number) {
    this._router.navigate([userId], { relativeTo: this._activatedRoute });
  }

  onCreationRequested() {
    this._router.navigate(['app/admin']);
  }

  async onUserRemovalRequested(user: UserRow) {
    const reply = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿De verdad quieres eliminar el usuario '${user.firstNames}'?`,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      confirmButtonColor: "f44336",
      icon: "warning"
    });
    
    if (!reply.isConfirmed) {
      return;
    }

    try {
      await this.loader.showLoadingIndicator(async () => {
        await deleteUser(user.userId);
        await this.reloadUsers();
      });
    } catch (error) {
      await Swal.fire("Error", 
        "No fue posible contactar el servidor, por favor verifica tu conexión a internet e inténtalo de nuevo", 
        "error"
      );
      return;
    }

    await Swal.fire("Éxito", "El usuario ha sido eliminado exitosamente", "info");
  }

  filterUsers(userRow: UserRow, filter: string): boolean {
    const filterText = filter.toUpperCase();
    return [
      userRow.email.toUpperCase(),
      userRow.firstNames.toUpperCase(),
      userRow.lastNames.toUpperCase()
    ].some(text => text.includes(filterText));
  }
}