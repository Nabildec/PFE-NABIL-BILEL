import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emitters } from './../emitters/emitters';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  
  
  constructor(
    private http :HttpClient,
    private router: Router
  ) { }

  authentificated=false
  name ="";
  role="";
  class = "hide" ; 

  ngOnInit(): void {
    this.http.get('http://localhost:3000/user',{withCredentials:true}).subscribe(
      (res:any) =>{
        this.name =`${res[0].first_name}  ${res[0].last_name} `;
        this.role =` ${res[0].role}`;
        if(res[0].role=="Admin") {
          this.class = "" ; 
        }
        //user logged in
        Emitters.authEmitter.emit(true)
        
      },
      err =>{
        //user not logged in 
        this.name = `You are not logged in`;
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
    if(confirm("Deconexion")){

    this.http.post('http://localhost:3000/logout',{},{withCredentials:true}).subscribe(
      ()=>{
        this.authentificated=false;
        this.router.navigate(['/'])
      }
    )

  }
  }
  }

