import { Component, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RickAndMortyService } from '../../services/rick-and-morty.service';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

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
  totalPages: number = 1; // 🔹 Total de páginas disponibles

    // Variables para los filtros
     // 🔹 Filtros para la API
  // 🔹 Filtros en un solo objeto (ahora bien tipado)
  filters: { name: string; species: string; type: string; gender: string } = {
    name: '',
    species: '',
    type: '',
    gender: ''
  };
    showFilters: boolean = false; // 🔹 Controla si los filtros están visibles
   
   
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() selectCharacter = new EventEmitter<any>();
  @Output() totalsUpdated = new EventEmitter<{ species: any; type: any }>(); // 🔹 Evento para enviar los totales
  @Output() favoriteCharacter = new EventEmitter<any>(); // 🔹 Evento para favoritos
  
  
  constructor(private apiService: RickAndMortyService) {}



  ngOnInit(): void {
    this.getCharacters(this.currentPage);
  }

  getCharacters(page: number): void {
    this.apiService.getCharacters(page, this.filters).subscribe({
      next: (data: { results: any[], info: { pages: number, count: number } }) => {
        this.characters = data.results.map(char => ({
          ...char,
          species: char.species === 'unknown' ? 'Desconocido' : char.species,
          gender: char.gender === 'unknown' ? 'Desconocido' : char.gender,
          status: char.status === 'unknown' ? 'Desconocido' : char.status
        }));
  
        this.totalItems = data.info.count; // 🔹 Total de personajes en la API
        this.totalPages = data.info.pages; // 🔹 Total de páginas
  
        console.log('✅ Página actual:', this.currentPage, '| Total páginas:', this.totalPages);
        this.calculateTotals();
      },
      error: (err: any) => console.error('❌ Error al obtener datos:', err)
    });
  }
  

  applyFilters() {
    this.currentPage = 1;
    console.log('✅ Aplicando filtros:', this.filters); // 🔍 Verifica en consola los filtros aplicados
    this.getCharacters(this.currentPage); // 🔹 Llamar a la API solo cuando el usuario haga clic
  }
  

  onPageChange(event: any) {
    const newPage = event.pageIndex + 1;
  
    if (newPage > this.totalPages) {
      console.warn('⚠ Intentaste ir más allá de la última página.');
      return;
    }
  
    this.currentPage = newPage;
    console.log('📌 Cambiando a la página:', this.currentPage);
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

  
}
