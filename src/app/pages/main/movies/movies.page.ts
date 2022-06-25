import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Movie } from 'src/app/models/Movies';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {
  movies: Movie[] = [];

  constructor(private movie: MovieService, private menuCtrl: MenuController,) { }

  ngOnInit() {
    this.getLatestMovies();
  }

  toggleMenu() {
    this.menuCtrl.open('home-menu');
  }

  getLatestMovies() {
    this.movie.getLatestMovies().subscribe((res: any) => {
      this.movies = res?.results
    }, err => {
    })
  }

}
