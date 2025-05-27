import {Component, Input} from '@angular/core';
import {Avatar} from 'primeng/avatar';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [Avatar],
  template: `
    <p-avatar
      [image]="user || undefined"
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
  @Input() size?: 'normal' | 'large' | 'xlarge';

  onClick(event: MouseEvent) {
    if (this.userMenu) {
      this.userMenu.toggle(event);
    }
  }
}
