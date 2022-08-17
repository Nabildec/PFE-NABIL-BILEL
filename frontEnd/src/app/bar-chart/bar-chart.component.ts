import { Component, OnInit , Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'barChart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  constructor(private http: HttpClient) 
  { 
    
  }
  x:number=300
  y:number=400

  info1: any[] = [];
  info2: any[] = [];
  

  @Input() duration : string = ""; 


  barMaxWidth="30"
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Service';
  showYAxisLabel = true;
  yAxisLabel = 'Nombre d\'erreur';
  // colorScheme: string | any =  {
  //   domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  // };

  //pie chart 
  gradient1: boolean = true;
  showLegend1: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = 'below';




   ngOnChanges(){
    this.http.get("http://localhost:3000/api/nbErrors/"+this.duration).subscribe((res:any) =>{
      this.info1 =res[0];
      this.info2 = res[1]; 
} ); 
   }
  ngOnInit(): void {
  }

}
