import { Component, OnInit ,  Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-statistique',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.css']
})
export class StatistiqueComponent implements OnInit {
  monthButton: string=""
  weekButton: string="active"
  duration : string = "week" ; 
  entete :[] = []; 
  constructor(private http: HttpClient) { this.loadEntete(); }
   ngOnInit(): void {
  }
   
  loadEntete(): void {
    this.http.get('http://localhost:3000/api/nbErrorsEntete/'+this.duration).subscribe((res:any) =>{
          this.entete =res;      
} ); 
  }

//   ngOnChanges(){
//     this.http.get('http://localhost:3000/api/nbErrorsEntete/'+this.duration).subscribe((res:any) =>{
//       this.entete =res;
//       console.log(res);
// } ); 

//   }

  turnToMonthly(): void {
    this.monthButton="active";
    this.weekButton=""
    this.duration = "Month";  
    this.http.get('http://localhost:3000/api/nbErrorsEntete/month').subscribe((res:any) =>{
      this.entete =res;
      
} );

  }

  turnToWeekly(): void {
    this.monthButton="";
    this.weekButton="active"
    this.duration = "Week"; 
    this.http.get('http://localhost:3000/api/nbErrorsEntete/week').subscribe((res:any) =>{
    this.entete =res;
     } );

  }



  
}
