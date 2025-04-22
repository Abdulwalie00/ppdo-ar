import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-image-dialog',
  template: `
    <div class="p-4">
      <img
        ngSrc="{{ data.imageUrl }}"
        alt="Event Image"
        width="800"
        height="600"
        class="max-w-full max-h-[80vh]"
      />
    </div>
  `,
  imports: [
    NgOptimizedImage
  ],
  standalone: true
})
export class ImageDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }) {}
}
