import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.css'],
  standalone: true, // Si es un componente standalone
  imports: [CommonModule] // Agregar CommonModule aquí
})
export class CharacterDetailComponent implements OnChanges{
  @Input() character: any; //  Permite recibir datos desde el padre (app.component)
  ngOnChanges() {
    if (this.character) {
      this.character.origin.name = this.character.origin.name === 'unknown' ? 'Desconocido' : this.character.origin.name;
    }
  }

  
}