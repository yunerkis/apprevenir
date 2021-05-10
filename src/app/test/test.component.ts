import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { TestService } from '../services/test/test.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray  } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InformationModalComponent } from './information-modal/information-modal.component';
import { ConfidentialModalComponent } from './confidential-modal/confidential-modal.component';
import { LeveModalComponent } from './leve-modal/leve-modal.component';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  addiction = null;
  addiction_id = false;
  addictionArray = [];
  testResults = [];
  imagesBaseUrl = `${environment.url}/storage/images`;
  test = {};
  formGroup: FormGroup;
  answers = [];
  answer = {};
  questions: any;
  result = false;
  resultLevel = "";
  url_video = "";
  professional_help = "";
  url_interest = "";
  order = {
    0:"a",
    1:"b",
    2:"c",
    3:"d",
    4:"e",
    5:"f",
    6:"g",
    7:"h",
    8:"i",
    9:"j",
    10:"k",
    11:"l",
    12:"m",
  };
  gifLevel = {
    'Leve': '<img src="../../../assets/images/leve.gif" alt="leve" width="290px">',
    'Ausencia de Ansiedad': '<img src="../../../assets/images/leve.gif" alt="leve" width="290px">',
    'Ausencia de depresión': '<img src="../../../assets/images/leve.gif" alt="leve" width="290px">',
    'Moderado': '<img src="../../../assets/images/moderado.gif" alt="moderado" width="290px">',
    'Severo': '<img src="../../../assets/images/severo.gif" alt="severo" width="290px">',
    'Presencia de Ansiedad': '<img src="../../../assets/images/severo.gif" alt="severo" width="290px">',
    'Presencia de depresión': '<img src="../../../assets/images/severo.gif" alt="severo" width="290px">',
  };
  colorsLevel = {
    'Leve': 'color: #20E57E',
    'Ausencia de Ansiedad': 'color: #20E57E',
    'Ausencia de depresión': 'color: #20E57E',
    'Moderado': 'color: #FFA14E',
    'Severo': 'color: #FF4E60',
    'Presencia de Ansiedad': 'color: #FF4E60',
    'Presencia de depresión': 'color: #FF4E60',
  };

  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(
    private route: ActivatedRoute,
    public testService: TestService,
    private formBuilder: FormBuilder,
    private _sanitizer: DomSanitizer,
    public dialog: MatDialog,
  ) { }

  openDialogInformation(test) {
    const dialogRef = this.dialog.open(InformationModalComponent, {
      data: {
        test: test
      },
      id: "modal-home-padding"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogConfidential() {
    const dialogRef = this.dialog.open(ConfidentialModalComponent, {
      id: "modal-confidencial-width"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogSuppor(levelResult) {
    const dialogRef = this.dialog.open(LeveModalComponent, {
      id: "modal-drugs-width ",
      data: {
        level:levelResult,
        gifLevel: this.gifLevel[levelResult],
        colorsLevel: this.colorsLevel[levelResult]
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({formArray: this.formBuilder.array([])});

    const id = this.route.snapshot.paramMap.get("id");

    this.addiction = this.route.snapshot.queryParamMap.get("addiction");

    this.testService.getTest(id).subscribe(res => {
      this.test = res['data'];
      this.questions =  this.test['questions'].map((question, i)=>{
        this.answer = {};

        if (i == 0 && this.test['name'] == 'Drogas') {
          this.answer['addiction'] = ['', Validators.required];
        } else if (this.test['name'] == 'Drogas') {
          this.test['addictions'].map((addiction) => {
            this.answer['answer_'+addiction.id+'_'+question.id] = ['', Validators.required];
          });
        } else {
          this.answer['answer_'+question.id] = ['', Validators.required];
        }
        
        this.answers.push(this.formBuilder.group(this.answer));
        
        if (this.addiction != null) {
          question.question = question.question.replace('varI', this.addiction);
        }
        
        return question;
      });
      this.formGroup = this.formBuilder.group({ formArray: this.formBuilder.array(this.answers) });
      this.openDialogConfidential();
    });
  }

  onSubmit() {

    let arrayAnswers =  this.formGroup.value.formArray;
    let key = 'answer_';
    let objAnswers = [];
    let testArray = false;

    if (this.addictionArray.length !== 0) {
      testArray = true;
      this.addictionArray.forEach((item, i) => {
        let objAnswersAddiction = [];
        arrayAnswers.forEach((elem, inx) => {
          for (const [key, value] of Object.entries(elem)) {
            if (inx !== 0) {
              let cadena =  key.split('_');
              let id;
              if (cadena.length == 3) {
                id = cadena[2];
              }
              objAnswersAddiction.push([value, id]);
            }
          }
        });
        objAnswers.push({
          'addiction': item.id,
          'answers': objAnswersAddiction
        });
      });
      console.log(objAnswers);
    } else {
      arrayAnswers.forEach((e, i) => {
        for (const [key, value] of Object.entries(e)) {
          let cadena =  key.split('_');
          let id;
          if (cadena.length == 2) {
            id = cadena[1];
          } 
          objAnswers.push([value, id]);
        }
      });
    }

    if (!this.addiction_id) {
      this.route.snapshot.queryParamMap.get("addiction_id")
    }
    
    let result = {
      'test_id': this.test['id'],
      'answers': objAnswers,
      'addiction_id': this.addiction_id,
      'test_array': testArray
    }

    this.testService.storeAnswer(result).subscribe( res => {
      this.result = true;
      res['data'].map((result) => {
        this.testResults.push({
          'resultLevel': result['resultLevel'],
          'url_video': result['url_video'],
          'professional_help': result['professional_help'],
          'url_interest': result['url_interest'],
          'addiction': result['addiction']
        });
      });
    });
  }

  getVideoIframe(url) {
    var video, results;

    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];

    return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);   
  }

  selectAddiction(event) {

    let id = this.test['addictions'][event.source.value].id;
    
    if (event.checked) {
      this.addictionArray.push({
        'id':id,
        'desc': this.test['addictions'][event.source.value].description,
        'order': event.source.value
      })
    } else {
      this.addictionArray.forEach((value,index) => {
        if(value.id==id) this.addictionArray.splice(index,1);
      });
    }

    this.test['questions'].map((question, i)=>{
      if (i != 0) {
        this.test['addictions'].map((addiction) => {
          this.addictionArray.map((addiction2, inx)=> {
            if (addiction2.id == addiction.id) {
              this.formGroup.controls['formArray']['controls'][i]['controls']['answer_'+addiction.id+'_'+question.id].setValidators([Validators.required]);
            } else {
              this.formGroup.controls['formArray']['controls'][i]['controls']['answer_'+addiction.id+'_'+question.id].clearValidators();
              this.formGroup.controls['formArray']['controls'][i]['controls']['answer_'+addiction.id+'_'+question.id].updateValueAndValidity();
            }
          });
        });
      }
    });
  }
}
