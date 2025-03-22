import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // 🔹 Importamos CommonModule

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  standalone: true,
  imports: [CommonModule] // 🔹 Agregamos CommonModule aquí
})
export class FavoritesComponent {
  @Input() favoriteCharacter: any = null;
  @Output() selectFavorite = new EventEmitter<any>();

  showFavorite() {
    if (this.favoriteCharacter) {
      this.selectFavorite.emit(this.favoriteCharacter);
    }
  }
}
