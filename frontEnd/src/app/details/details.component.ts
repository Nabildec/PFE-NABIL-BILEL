import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  
  constructor(private http: HttpClient, private route: ActivatedRoute ) {

  }

  posts: any[] = [];
   title : any ; 
  x: any

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      var id = params.get('id');
      let x = null;
      this.loadDetails(id);
    });

    //class hide


  }

  loadDetails(x: string | null) {
    this.http.get("http://localhost:3000/getSubStates/" + x).subscribe((posts: any) => {
      this.posts = posts;
      console.log(window.history.state.pageTitle);
      //Avis Karim 
      switch (x){
        case "S_SITEWEB": this.title = "Site Web"
        break;
        case "S_PHARMACIE": this.title = "Service Pharmacie"
        break;
        case "S_INTEROPERABILITES": this.title = "Service Interoperabilites"
        break;
        case "S_ASSURES": this.title = "Service Assures"
        break;
        case "S_EAFFILIATION": this.title = "Service E-affiliation"
        break;
        case "_S_ANEM": this.title = "Service ANEM"
        break;
        case "_S_CNL": this.title = "Service CNL"
        break;
        case "_S_OSMT": this.title = "Service Organisation syndicale"
        break;
        case "_S_QR": this.title = "Service QR code"
        break;
        
       
      } 
    }
    )
  };

  ngOnChange() {
    console.log(this.title) ; 
  }


  
}
