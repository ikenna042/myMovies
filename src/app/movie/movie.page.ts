import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MovieService } from '../services';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.page.html',
  styleUrls: ['./movie.page.scss'],
})
export class MoviePage implements OnInit {
  movie = null;
  imageUrl = environment.images;

  constructor(private route: ActivatedRoute,
              private movieService: MovieService) { }

  ngOnInit() {
    this.getMovie();
  }

  getMovie() {
    const id = this.route.snapshot.paramMap.get('id');
    this.movieService.getMovieDetail(id).subscribe(res => {
      this.movie = res;
      console.log({res})
    })
    

  }

}
