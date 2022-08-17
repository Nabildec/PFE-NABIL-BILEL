import { Component, OnInit } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.css']
})
export class ParametresComponent implements OnInit {

  constructor(private http: HttpClient
    ,private router :Router) {
    this.loadPosts();
    this.totalLength = this.posts.length;
  }
  posts: any[] = []
  totalLength: any;
  page: number = 1;
  
  food =[
    {id:1,select:false,name:'hey'},
    {id:2,select:true,name:'hey'},
    {id:3,select:false,name:'hey'}
  ]

  loadPosts() {
    this.http.get("http://localhost:3000/api/getAllUsers").subscribe((posts: any) => {
      this.posts = posts;
  })}
 

  ngOnInit(): void {
  }

  sendMail(e :any,mail:any) {
    if(e.currentTarget.checked){  
           this.http.put('http://localhost:3000/api/setReceive1/'+mail,{responseType: 'text'})
           .subscribe();
           console.log(mail," will receive emails");
     
      
    }
    else{
     
      this.http.put('http://localhost:3000/api/setReceive0/'+mail,{responseType: 'text'})
           .subscribe();
           console.log(mail," won't receive emails");
    
    }
 }


 deleteUser(mail:any):void{
   if(confirm("voulez vous supprimmer cet utilisateur")){
    this.http.delete("http://localhost:3000/api/deleteUsert/"+mail)
    .subscribe();
    window.location.reload();
   }
  
}


}
