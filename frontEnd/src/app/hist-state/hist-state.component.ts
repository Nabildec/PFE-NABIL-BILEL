import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-hist-state',
  templateUrl: './hist-state.component.html',
  styleUrls: ['./hist-state.component.css']
})
export class HistStateComponent implements OnInit {

  constructor(private http: HttpClient) {
    this.loadPosts();
    this.totalLength = this.posts.length;
  }

  totalLength: any;
  page: number = 1;
  posts: any[] = []
  loadPosts() {
    this.http.get("http://localhost:3000/getHistorique").subscribe((posts: any) => {
      this.posts = posts;
    })
  };


  ngOnInit(): void {
  }

}
