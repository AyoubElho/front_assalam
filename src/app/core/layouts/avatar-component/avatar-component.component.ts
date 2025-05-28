import {Component, Input} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [Avatar],
  template: `
    <p-avatar
      [image]="imageUrl"
      [icon]="!user ? 'pi pi-user' : undefined"
      class="mr-2"
      (click)="onClick($event)"
      [size]="size || 'large'"
      shape="circle"
    />
  `
})
export class AvatarComponent {
  @Input() user: any;
  @Input() userMenu: any;
  @Input() previewUrl: string | null = null;
  @Input() size?: 'normal' | 'large' | 'xlarge';

  get imageUrl(): string | undefined {
    if (typeof this.user === 'string') {
      return this.user; // when previewUrl (base64 or temp URL) is passed directly
    }

    return this.user?.pic ? `${environment.apiURL}/${this.user.pic}` : undefined;
  }

  onClick(event: MouseEvent) {
    if (this.userMenu) {
      this.userMenu.toggle(event);
    }
  }
}
