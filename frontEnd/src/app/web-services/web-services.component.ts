import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-web-services',
  templateUrl: './web-services.component.html',
  styleUrls: ['./web-services.component.css']
})
export class WebServicesComponent implements OnInit {

  constructor(private http: HttpClient) {
    this.loadPosts();
  }
  posts: any[] = []
  x: any;
  class = "hide";
  cpt = 0;
  interId: string = "S_INTEROPERABILITES";
  title = "" ; 
  //7mora 9bel khdora 
  loadPosts() {
    this.http.get("http://localhost:3000/api/test").subscribe((posts: any) => {
      this.posts = posts;
      for (let post of posts) {
        if (post.status == "Down") {
          this.cpt++
        }

      }
      if (this.cpt != 0) {
        this.class = "";
        console.log("Pas d'anomalies");
      }
    }

    )
  };



  ngOnInit(): void {
  }

}
