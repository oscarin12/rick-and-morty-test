import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { CharacterListComponent } from './components/character-list/character-list.component';
import { CharacterDetailComponent } from './components/character-detail/character-detail.component';
import { TotalsComponent } from './components/totals/totals.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CharacterListComponent,CharacterDetailComponent,TotalsComponent,FavoritesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mundo de rick y morty';
  selectedCharacter: any = null;
  totalsData: { species: any; type: any } | null = null; // 🔹 Guardamos los totales aquí
  favoriteCharacter: any = null; // 🔹 Guardamos el personaje favorito

  onCharacterSelected(character: any) {
    this.selectedCharacter = character;
  }

  onTotalsUpdated(totals: { species: any; type: any }) {
    console.log('📥 Datos recibidos en AppComponent:', totals); // 🔍 Verificar que llegan los datos
    this.totalsData = totals; // 🔹 Almacenar los totales
  }
  onFavoriteCharacter(character: any) {
    console.log('📌 Nuevo favorito:', character);
    this.favoriteCharacter = character; // 🔹 Guardamos el favorito
  }
}
