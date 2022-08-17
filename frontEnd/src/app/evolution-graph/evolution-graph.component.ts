import { Component, OnInit  ,Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ScaleType} from '@swimlane/ngx-charts' ;
import { Color } from 'd3';

@Component({
  selector: 'evolutionGraph',
  templateUrl: './evolution-graph.component.html',
  styleUrls: ['./evolution-graph.component.css']
})
export class EvolutionGraphComponent implements OnInit {

    constructor( private http : HttpClient) 
  { 
  }
 
  
  

  colorScheme : any = {
    domain : ['#000000', '#0000FF','#FF0000', '#EE82EE', '#FFA500', '#582900', '#008000', '#D3D3D3']
  };

 @Input() duration : string = ""; 

data1 : any[] = [] ;
data2 : any[] = [] ;
data3 : any[] = [] ;
legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Time';
  yAxisLabel: string = 'Errors';
  legendPosition: any = 'below';

 


  
  
  
  ngOnChanges(){
    this.http.get("http://localhost:3000/api/nbErrorsEvolution/"+this.duration).subscribe((res:any) =>{
      this.data1 =res[0];
      this.data2 = res[1]; 

    
} );  
  

  }
  ngOnInit(): void {
  }


    }


