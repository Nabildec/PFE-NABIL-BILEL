import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-interoperabilite',
  templateUrl: './interoperabilite.component.html',
  styleUrls: ['./interoperabilite.component.css']
})
export class InteroperabiliteComponent implements OnInit {

  constructor(private http: HttpClient) {
    this.loadPosts();
  }
  posts: any[] = []
  x: any;
  class="hide";
  cpt = 0;
  interId :string = "S_INTEROPERABILITES";
  //7mora 9bel khdora , date format
  loadPosts() {
    this.http.get("http://localhost:3000/api/testInteroperabilites").subscribe((posts: any) => {
    this.posts = posts;
      for (let post of posts) {
        if (post.status == "Down") {
          this.cpt++
        }
        
      }
      if (this.cpt != 0) {
        this.class="";
        console.log("Pas d'anomalies");
}
    }

    )
  };

  ngOnInit(): void {
  }

}
