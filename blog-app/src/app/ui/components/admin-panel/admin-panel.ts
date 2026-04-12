import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  imports: [],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss',
})
export class AdminPanel {
  @Output() addClick = new EventEmitter<void>();
  @Input() articleCount: number = 0;
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
