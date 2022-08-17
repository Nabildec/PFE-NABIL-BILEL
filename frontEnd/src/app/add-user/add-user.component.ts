import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup ,Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from './../emitters/emitters';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  addform! :FormGroup;
  visible: boolean = true;
  changetype: boolean = true;
  x: string = ""
  
  authentificated = false


  constructor(
    private formBuilder :FormBuilder,
    private http :HttpClient,
    private router :Router
    ) { }

  ngOnInit(): void {
    this.addform = this.createAFormGroup();
  }
  createAFormGroup():FormGroup{
    return new FormGroup({
      first_name:new FormControl("",Validators.required),
      last_name:new FormControl("",Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [ Validators.required, Validators.minLength(7),]),
      role:new FormControl("",Validators.required),
      receiveMail: new FormControl("")
    })
  }
  Ajouter():void{
   this.http.post('http://localhost:3000/api/addUser',this.addform.getRawValue(),{responseType: 'text'})
    .subscribe(()=>{this.router.navigate(['/user/parametres'])});
    console.log(this.addform.value);

  }
  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype
    this.x = "show"


  }
  

}
