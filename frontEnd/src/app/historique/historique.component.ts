import { Component, OnInit , Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormGroup, FormControl} from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {
  stateButton: string="active"
  panneButton: string=""
  posts: any[] = []
  totalLength: any;
  page: number = 1;
  constructor(private http: HttpClient) {
    this.loadPostsState();
    this.totalLength = this.posts.length;

   }
   loadPostsState() {
    this.http.get("http://localhost:3000/getHistorique").subscribe((posts: any) => {
      this.posts = posts;
    })
  };
  state(): void {
    this.stateButton="active";
    this.panneButton="";
    this.range.reset() ; 

    this.http.get('http://localhost:3000/getHistorique').subscribe((posts:any) =>{
      
      this.posts = posts;
} );

  }

  panne(): void {
    this.stateButton="";
    this.panneButton="active";
    this.range.reset() ; 
    
    this.http.get('http://localhost:3000/getHistoriqueP').subscribe((posts:any) =>{
      this.posts = posts;
     } );

  }
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });


   ngOnInit(): void {
  }

  @Output() dateChange : EventEmitter<MatDatepickerInputEvent<any>> = new EventEmitter() ; 
  onDateChange(): void  {

      if(this.range.value.start  && this.range.value.end ) {
     //hna ndirou traitement. 
     let start = new Date(this.range.value.start);
     let end   = new Date(this.range.value.end );
     end.setDate(end.getDate()+1);

if(this.stateButton=="active") {
 this.posts = this.posts.filter(item => { 
   let date = new Date(item.date);
console.log(end);

   return (date >= start && date <= end);
 
   
});
} 
else { if (this.panneButton=="active") {
  this.posts = this.posts.filter(item => { 
    let date = new Date(item.error_date);
    return date >= start && date <= end;
 });
}
}
      
  }
  

  

}
  

}
