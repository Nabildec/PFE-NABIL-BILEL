import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-hist-panne',
  templateUrl: './hist-panne.component.html',
  styleUrls: ['./hist-panne.component.css']
})
export class HistPanneComponent implements OnInit {

  constructor(private http: HttpClient) {
    this.loadPosts();
    this.totalLength = this.posts.length;

  }

  totalLength: any;
  page: number = 1;
  posts: any[] = []
  loadPosts() {
    this.http.get("http://localhost:3000/getHistoriqueP").subscribe((posts: any) => {
      this.posts = posts;
      console.log(posts);



    })
  };
  ngOnInit(): void {
  }

}
