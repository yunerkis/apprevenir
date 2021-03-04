import { Component, OnInit } from '@angular/core';

export interface ProfileAnswer {
  number: string;
  question: string;
  answer: string;
}
const ELEMENT_DATA: ProfileAnswer[] = [
  {number: "Tecnologías", question: '08/09/20', answer: "MODERADO"},
];

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss']
})
export class ProfileModalComponent implements OnInit {
  
  displayedColumns: string[] = ['number', 'question', 'answer'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
