// src/app/shared/pipes/strip-html.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'stripHtml'
})
export class StripHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): string {
    if (!value) return '';

    // Create a temporary div element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;

    // Return the text content without HTML tags
    return tempDiv.textContent || tempDiv.innerText || '';
  }
}
