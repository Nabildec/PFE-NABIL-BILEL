import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from './../emitters/emitters';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  visible: boolean = true;
  changetype: boolean = true;
  x: string = ""
  form!: FormGroup;
  authentificated = false
  passMessage: string = ""
  mailMessage: string = ""
  passCorrect = true;
  mailCorrect = true;
  booleen =false
  booleen1 =false
  value ="webservice"
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.createFormGroup();

    Emitters.authEmitter.subscribe(
      (auth: boolean) => {
        this.authentificated = auth;
      }
    )
  }

  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype
    this.x = "show"


  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
    })
  }





  submit(): void {
    if (this.form.getRawValue().email) {
      if (this.form.getRawValue().password) {




        this.http.post('http://localhost:3000/login', this.form.getRawValue(), { withCredentials: true })
          .subscribe((res: any) => {
            // if(res.status == 400){


            // }
            this.router.navigate(['/user',this.value])

          }, (err: any) => {

            if (err.error.message == "Email inexistant") {
              this.mailMessage = err.error.message
              this.mailCorrect = false

            }
            if (err.error.message == "Mot de passe incorrecte") {

              this.passMessage = err.error.message
              this.passCorrect = false
            }

            console.log(err);

          }
          );
      }else{
        console.log('mdp invalid');
        this.booleen=true
        
      }

    }else{
      console.log('email invalid');
      this.booleen1 =true
      
    }

  }

  loginUser() {
    console.log(this.form.value);

  }
  toucher() {

    this.passCorrect = true

    this.mailCorrect = true

  


  }

}
