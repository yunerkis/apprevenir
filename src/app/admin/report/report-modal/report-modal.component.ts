import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.scss']
})
export class ReportModalComponent implements OnInit {

  color = {
    'Severo': '#FF4E60',
    'Moderado': '#FFA14E',
    'Leve': '#20E57E',
    'Ausencia de Ansiedad': '#20E57E',
    'Ausencia de depresión': '#20E57E',
    'Presencia de Ansiedad': '#FF4E60',
    'Presencia de depresión': '#FF4E60',
  };

  displayedColumns: string[] = ['N', 'Pregunta', 'Respuesta'];
  dataSource = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    this.data['answers'].forEach((e, i) => {
      e['question'] = this.data['questions'][i];
    });

    this.dataSource = this.data['answers'];
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
