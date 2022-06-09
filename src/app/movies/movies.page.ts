import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import {MovieService, StorageService} from '../services';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {
  movies = [];
  currentPage = 1;
  imageUrl = environment.images;
  public searchField;
  favMovies: any[];
  showFav = true;
  badMovies: any[];

  constructor(private moviesService: MovieService,
              private loadingCtrl: LoadingController,
              private storageService: StorageService) { }

  ngOnInit() {
    this.getFavMovies();
  }

  async getFavMovies() {
    const favouriteMovies = await this.storageService.getData('favouriteMovies');
    const savedBadMovies = await this.storageService.getData('badMovies');
    this.badMovies = savedBadMovies ? savedBadMovies : []
    if (favouriteMovies) {
      this.favMovies = favouriteMovies;
    } else {
      this.favMovies = [];
      this.showFav = false;
    }
  }


  async getMovies(event?: InfiniteScrollCustomEvent) {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'bubbles',
    });
    await loading.present();
    this.favMovies = await this.storageService.getData('favouriteMovies');
    if (!this.favMovies) {
      this.favMovies = []
    }
    const mappedFavs = this.favMovies.map(fav => fav.id);

    this.moviesService.searchMovies(this.searchField, this.currentPage).subscribe(res => {
      loading.dismiss();
      console.log({results: res.results});
      const results = res.results;
      const modifiedMovie = results.map(movie => {
        if (mappedFavs.includes(movie.id)) {
          return { ...movie, liked: true};
        }
        return movie;
      });
      console.log({ modifiedMovie });
      this.movies.push(...modifiedMovie);

      event?.target.complete();
      if (event) {
        event.target.disabled = res.total_pages === this.currentPage;
      }
      }
    )
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.getMovies(event);
  }

  async like(movie) {
    // check if movie is liked already
    console.log({movie})
    let favouriteMovies: any[] = await this.storageService.getData('favouriteMovies');
    console.log({favouriteMovies})
    if (favouriteMovies) {
      const existingLike = favouriteMovies.find(currentMovie => movie.id === currentMovie.id);
      if (existingLike) {
        const filteredFavorites = favouriteMovies.filter(filterMovie => filterMovie.id !== existingLike.id);
        this.favMovies = filteredFavorites;
        if (this.favMovies.length===0) {
          this.showFav = false;
        }
        await this.storageService.setData('favouriteMovies', filteredFavorites);
        return;
      }
    }
    // liking for first time
    const modifiedLike = {...movie, liked: true};
    if (!!favouriteMovies) {
      favouriteMovies.push(modifiedLike);
    } else {
      favouriteMovies = [];
      favouriteMovies.push(modifiedLike);
    }
    this.favMovies = favouriteMovies;
    await this.storageService.setData('favouriteMovies', favouriteMovies);
  }

  search() {
    this.showFav = false;
    // return console.log('search field = ', this.searchField)
    if (this.searchField.length>1) {
      this.showFav = false;
      this.moviesService.searchMovies(this.searchField).subscribe(async(res) => {
        console.log('search result => ', {res});
          this.favMovies = await this.storageService.getData('favouriteMovies');
          if (!this.favMovies) {
            this.favMovies = []
          }
          const mappedFavs = this.favMovies.map(fav => fav.id);
          const results = res.results;
          const modifiedMovie = results.map(movie => {
            if (mappedFavs.includes(movie.id)) {
              return { ...movie, liked: true};
            }
            return movie;
          });
        this.movies = modifiedMovie;
        _.pullAllBy(this.movies, this.badMovies, 'id')
        // const newArray = []
        // for (const m of this.movies) {
        //   if (this.badMovies.includes(m,0)) {
        //     newArray.push(m)
        //   }
        // }
        // console.log({newArray})
      }
      )
    } else {
      this.movies = [];
      this.showFav = true;
    }
  }

  onClear() {
    this.movies = [];
    this.showFav = true;
  }

  async remove(movie) {
    console.log({movie})
    const savedBadMovies: any[] = await this.storageService.getData('badMovies');
    this.badMovies = savedBadMovies ? savedBadMovies : []
    console.log({badMovies: this.badMovies})
    this.badMovies.push(movie)
    await this.storageService.setData('badMovies', this.badMovies);
    console.log({badMovies2: this.badMovies})
    this.movies = this.movies.filter(filterMovie => filterMovie.id !== movie.id);
  }

}
