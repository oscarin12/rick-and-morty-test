import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule,MatSlideToggleModule,MatButtonModule,MatPaginatorModule]
})
export class CharacterListComponent implements OnInit {
  characters: any[] = [];
  totalItems: number = 0; // 🔹 Total de personajes en la API
  pageSize: number = 20; // 🔹 Cantidad de personajes por página
  currentPage: number = 1; // 🔹 Página actual
    // Variables para los filtros
    nameFilter: string = '';
    speciesFilter: string = '';
    typeFilter: string = '';
    genderFilter: string = '';
    showFilters: boolean = false; // 🔹 Controla si los filtros están visibles

  @Output() selectCharacter = new EventEmitter<any>();
  @Output() totalsUpdated = new EventEmitter<{ species: any; type: any }>(); // 🔹 Evento para enviar los totales
  @Output() favoriteCharacter = new EventEmitter<any>(); // 🔹 Evento para favoritos
  constructor(private apiService: RickAndMortyService) {}
  ngOnInit(): void {
    this.getCharacters(this.currentPage);
  }

  getCharacters(page: number): void {
    this.apiService.getCharacters(page).subscribe({
      next: (data: { results: any[], info: { pages: number, count: number } }) => {
        this.characters = data.results.map(char => ({
          ...char,
          species: char.species === 'unknown' ? 'Desconocido' : char.species,
          gender: char.gender === 'unknown' ? 'Desconocido' : char.gender,
          status: char.status === 'unknown' ? 'Desconocido' : char.status
        }));
        this.totalItems = data.info.count; // 🔹 Total de personajes
        this.calculateTotals();
      },
      error: (err: any) => console.error('❌ Error al obtener datos:', err)
    });
  }
  // 🔹 Método para manejar el cambio de página con `mat-paginator`
  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1; // 🔹 `mat-paginator` usa índice base 0, por eso sumamos 1
    this.pageSize = event.pageSize;
    this.getCharacters(this.currentPage);
  }
  select(char: any) {
    this.selectCharacter.emit(char);
  }
 // 🔹 Función para marcar un personaje como favorito
 addToFavorites(char: any) {
  console.log('🌟 Personaje favorito seleccionado:', char);
  this.favoriteCharacter.emit(char); // 🔹 Enviar personaje a `app.component.ts`
}
  calculateTotals(): void {
    const speciesCount: { [key: string]: number } = {};
    const typeCount: { [key: string]: number } = {};

    this.characters.forEach(char => {
      // 🔹 Sumar cuántos personajes hay de cada species
      speciesCount[char.species] = (speciesCount[char.species] || 0) + 1;

      // 🔹 Sumar cuántos personajes hay de cada type
      const typeKey = char.type || 'Sin Tipo'; // Si no tiene type, mostrar "Sin Tipo"
      typeCount[typeKey] = (typeCount[typeKey] || 0) + 1;
    });

    // 🔹 Enviamos los totales al componente padre
    console.log('📊 Totales calculados:', { species: speciesCount, type: typeCount }); 
    this.totalsUpdated.emit({ species: speciesCount, type: typeCount });
    
  }

    // 🔹 Función para mostrar/ocultar los filtros
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
  // 🔹 Función que filtra los personajes según los inputs
  filteredCharacters() {
    return this.characters.filter(char =>
      char.name.toLowerCase().includes(this.nameFilter.toLowerCase()) &&
      char.species.toLowerCase().includes(this.speciesFilter.toLowerCase()) &&
      (char.type?.toLowerCase() || 'sin tipo').includes(this.typeFilter.toLowerCase()) &&
      char.gender.toLowerCase().includes(this.genderFilter.toLowerCase())
    ); }
}
