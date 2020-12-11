import { Component, OnInit } from '@angular/core';
interface User {
  name: string;
  id: number;
}

interface Data {
  users: User[];
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  selectable = true;
  removable = true;
  data: Data = {
    users: [
    {name: 'User1', id: 0},
    {name: 'User2', id: 1},
    {name: 'User3', id: 2},
  ]};

  remove(getId: number): void {
    this.data.users = [...this.data.users.filter(({id}) => getId !== id)];
  }

  constructor() { }

  ngOnInit(): void {
  }

}
