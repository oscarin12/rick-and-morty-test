import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.css'],
  standalone: true,
  imports: [CommonModule] 
})
export class TotalsComponent implements OnChanges {
  @Input() totals: { species: any; type: any } | null = null;

  ngOnChanges() {
    console.log('📊 Datos recibidos en TotalsComponent:', this.totals);
  }
}
