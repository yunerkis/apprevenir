import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { TestService } from '../services/test/test.service';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray  } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  url = this.testService.url;
  test = {};
  formGroup: FormGroup;
  answers = [];
  answer = {};
  questions: any;
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

  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(
    private route: ActivatedRoute,
    public testService: TestService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({formArray: this.formBuilder.array([])});

    const id = this.route.snapshot.paramMap.get("id");

    this.testService.getTest(id).subscribe(res => {

      this.test = res['data'];
      this.questions =  this.test['questions'];
      this.test['questions'].forEach((question, i) => {
        this.answer = {};
        this.answer['answer_'+i] = ['', Validators.required];
        this.answers.push(this.formBuilder.group(this.answer));
      });
      this.formGroup = this.formBuilder.group({ formArray: this.formBuilder.array(this.answers) });
      console.log(this.test);
    });

   
  }

}
