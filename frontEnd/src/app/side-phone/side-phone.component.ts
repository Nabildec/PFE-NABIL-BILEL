import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-side-phone',
  templateUrl: './side-phone.component.html',
  styleUrls: ['./side-phone.component.css']
})
export class SidePhoneComponent implements OnInit {

  constructor(
    private http :HttpClient
  ) { }
  class = "hide" ; 
  name ="";
  role="";

  ngOnInit(): void {
    this.http.get('http://localhost:3000/user',{withCredentials:true}).subscribe(
      (res:any) =>{
        this.name =`${res[0].first_name}  ${res[0].last_name} `;
        this.role =` ${res[0].role}`;
        if(res[0].role=="Admin") {
         
        }
       
        
      },
      err =>{
        //user not logged in 
        this.name = `You are not logged in`;
        
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
        
      }
    )
  }

}
