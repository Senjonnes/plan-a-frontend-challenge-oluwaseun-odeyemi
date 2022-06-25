import { Component } from '@angular/core';
import { Movie } from 'src/app/models/Movies';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  movies: Movie[] = [];

  constructor(private movie: MovieService) { }

  ngOnInit() {
    this.getLatestMovies();
  }

  getLatestMovies() {
    this.movie.getLatestMovies().subscribe((res: any) => {
      console.log(res);
      this.movies = res?.results
    }, err => {
      console.log(err);
    })
  }

}
