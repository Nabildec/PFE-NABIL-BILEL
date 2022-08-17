import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from './../emitters/emitters';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-set-user',
  templateUrl: './set-user.component.html',
  styleUrls: ['./set-user.component.css']
})
export class SetUserComponent implements OnInit {

  setform!: FormGroup;
  posts: any[] = []
  firstName :any
  lastName = ""
  email = ""

  visible: boolean = true;
  changetype: boolean = true;
  x: string = ""
  
  authentificated = false


  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    
  }
  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype
    this.x = "show"


  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      var id = params.get('id');
      console.log(id);
      this.loadPosts(id)
      console.log(this.posts[0]);
      
     // this.setform = this.createAFormGroup(this.posts[0].email);
    })
  }




  loadPosts (id: string | null) {
    this.http.get("http://localhost:3000/api/getAUser/" + id).subscribe((postss: any) => {
      this.posts = postss;
      console.log(this.posts[0].email);

      
      /*console.log(postss[0].first_name);
      this.firstName = postss[0].first_name
      console.log("hey ",this.posts[0]);*/

    this.setform=this.createAFormGroup(
      this.posts[0].first_name,
      this.posts[0].last_name,
      this.posts[0].email,
      this.posts[0].password,
      this.posts[0].role,
      this.posts[0].receiveMail)
    console.log("executed so far");
    

    })
  }


  createAFormGroup(firstName:any,lastName:any,email:any,password:any,role:any,receiveMail:any): FormGroup {



    return new FormGroup({
      first_name: new FormControl(firstName, Validators.required),
      last_name: new FormControl(lastName, Validators.required),
      
      password: new FormControl(password, [Validators.required, Validators.minLength(7),]),
      role: new FormControl(role, Validators.required),
      receiveMail: new FormControl(receiveMail)
    })
  }


  modifier(id: string | null): void {
    this.http.put('http://localhost:3000/api/modifyUser/'+id, this.setform.getRawValue(), { responseType: 'text' })
      .subscribe(() => { this.router.navigate(['/user/parametres']) });
    console.log(this.setform.value);

  }

}
