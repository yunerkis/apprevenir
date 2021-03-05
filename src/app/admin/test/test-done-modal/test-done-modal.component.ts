import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-test-done-modal',
  templateUrl: './test-done-modal.component.html',
  styleUrls: ['./test-done-modal.component.scss']
})
export class TestDoneModalComponent implements OnInit {
  
  color = {
    'Severo': '#FF4E60',
    'Moderado': '#FFA14E',
    'Leve': '#20E57E'
  };

  displayedColumns: string[] = ['N', 'Pregunta', 'Respuesta'];
  dataSource = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.dataSource = this.data.test['answers'];
  }
  
  setStyle(color) {
    return {
      'background-color': this.color[color],
      'color': '#fff',
      'padding-left': '15px',
      'padding-right': '15px',
      'border-radius': '10px',
      'padding-top': '1px',
      'padding-bottom': '1px',
    }
  }
}
