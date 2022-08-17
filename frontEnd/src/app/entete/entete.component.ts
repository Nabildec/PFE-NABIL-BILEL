import { Component, OnInit , Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'entete',
  templateUrl: './entete.component.html',
  styleUrls: ['./entete.component.css']
})
export class EnteteComponent implements OnInit {
   
  @Input() duration : string = "week";  
  entete :[] = []; 
  state : boolean = false ; 
  constructor(private http: HttpClient) { this.loadEntete()}

   
  loadEntete(): void {
    this.http.get('http://localhost:3000/api/nbErrorsEntete/week').subscribe((res:any) =>{
          this.entete =res;
          console.log(this.entete);
        
} );
 
  }
  
  ngOnChanges(){
    this.http.get('http://localhost:3000/api/nbErrorsEntete/'+this.duration).subscribe((res:any) =>{
      this.entete =res;
      console.log(this.entete);
    
} ); 

  }
  ngOnInit(): void {
  }

}
