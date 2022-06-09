import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ApiResult {
  page: number;
  results: any[];
  total_pages: number;
  total_number: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  getMovies(page = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(
      `${environment.baseUrl}/movie/popular?api_key=${environment.apiKey}&page=${page}`
    );
  }

  searchMovies(query = '', page = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(
      `${environment.baseUrl}/search/movie?api_key=${environment.apiKey}&query=${query}&page=${page}`
    );
  }

  getMovieDetail(id: string) {
    return this.http.get(
      `${environment.baseUrl}/movie/${id}?api_key=${environment.apiKey}`
    );
  }
}
