import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RickAndMortyService } from '../../services/rick-and-morty.service';


@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CharacterListComponent implements OnInit {
  characters: any[] = [];

  @Output() selectCharacter = new EventEmitter<any>();
  @Output() totalsUpdated = new EventEmitter<{ species: any; type: any }>(); // 🔹 Evento para enviar los totales
  @Output() favoriteCharacter = new EventEmitter<any>(); // 🔹 Evento para favoritos
  constructor(private apiService: RickAndMortyService) {}

  ngOnInit(): void {
    this.apiService.getCharacters().subscribe({
      next: (data: { results: any[] }) => {
        this.characters = data.results;
        this.calculateTotals(); // 🔹 Calcula los totales cuando llegan los datos
        this.characters = data.results.map(char => ({
          ...char,
          species: char.species === 'unknown' ? 'Desconocido' : char.species,
          gender: char.gender === 'unknown' ? 'Desconocido' : char.gender,
          status: char.status === 'unknown' ? 'Desconocido' : char.status

        }));
      },
      error: (err: any) => console.error('❌ Error al obtener datos:', err)
    });
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
}
