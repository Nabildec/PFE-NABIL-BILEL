import { Emitters } from './../emitters/emitters';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message ="";
  authentificated=false
  class="hide"
 
  constructor(
    private http :HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }
 
  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      var id = params.get('value');
      
    })



    this.http.get('http://localhost:3000/user',{withCredentials:true}).subscribe(
      (res:any) =>{
        this.message =`${res[0].name}  ${res[0].last_name}  ${res[0].role}`;
        //user logged in
        Emitters.authEmitter.emit(true)
        
      },
      err =>{
        //user not logged in 
        this.message = `You are not logged in`;
        this.router.navigate(['/'])
        Emitters.authEmitter.emit(false)
        
      }
    )

    Emitters.authEmitter.subscribe(
      (auth:boolean)=>{
           this.authentificated=auth;
           
      }
    )

   
  }
  hideShow():void{
    if (this.class=="hide"){
      this.class=""
    }else{
      this.class="hide"

    }
  }
  logout():void{
    this.http.post('http://localhost:3000/logout',{},{withCredentials:true}).subscribe(
      ()=>{
        this.authentificated=false;
      }
    )
  }

}
