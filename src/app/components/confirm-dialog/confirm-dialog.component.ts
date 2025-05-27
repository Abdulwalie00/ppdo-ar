import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow max-w-sm w-full">
        <p class="text-lg mb-4">{{ message }}</p>
        <div class="flex justify-end gap-2">
          <button (click)="confirm.emit(false)" class="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
          <button (click)="confirm.emit(true)" class="px-4 py-2 bg-blue-600 text-white rounded">Confirm</button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  @Input() message = '';
  @Output() confirm = new EventEmitter<boolean>();
}
