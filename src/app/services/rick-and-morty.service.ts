import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RickAndMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  getCharacters(page: number = 1, filters?: any): Observable<any> {
    let queryParams = `?page=${page}`; // 🔹 La API solo permite cambiar la página, no el tamaño

    if (filters) {
      if (filters.name) queryParams += `&name=${filters.name}`;
      if (filters.species) queryParams += `&species=${filters.species}`;
      if (filters.type) queryParams += `&type=${filters.type}`;
      if (filters.gender) queryParams += `&gender=${filters.gender}`;
    }

    console.log('🌍 URL de la API:', `${this.apiUrl}${queryParams}`); // 🔍 Verifica la URL
    return this.http.get(`${this.apiUrl}${queryParams}`);
  }
}

