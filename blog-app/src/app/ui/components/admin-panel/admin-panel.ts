import {Component, EventEmitter, input, output} from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  imports: [],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss',
})
export class AdminPanel {
  public addClick = output<void>();
  public articleCount = input<number>(0);
  isStatsModalOpen = false;

  onAddClick() {
    this.addClick.emit();
  }

  openStats() {
    this.isStatsModalOpen = true;
  }
  closeStats() {
    this.isStatsModalOpen = false;
  }
}
