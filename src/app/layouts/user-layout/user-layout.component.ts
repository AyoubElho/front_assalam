import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {Avatar} from 'primeng/avatar';
import {Menu} from 'primeng/menu';
import {AuthService} from '../../service/AuthService';
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-user-layout',
    standalone: true,
    imports: [RouterLink, Avatar, Menu, NgIf],
    templateUrl: './user-layout.component.html',
    styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {
    token = localStorage.getItem('jwt');
    role = localStorage.getItem('role');
    items: MenuItem[] = [];
    user = {
        name: '',
        email: '',
        pic: '',
    };

    constructor(private router: Router, private authService: AuthService) {
    }

    isLoggedIn(): boolean {
        return !!this.token;
    }

    isAdmin(): boolean {
        return this.role === 'admin';
    }

    logout(): void {
        localStorage.removeItem('jwt');
        localStorage.removeItem('role');
        window.location.reload();
    }

    ngOnInit(): void {
        this.authService.user().then(response => {
            this.user = response.data;

            const roleDisplay = this.isAdmin() ? 'مدير' : 'مستخدم';
            const displayName = `${this.user.name || 'المستخدم'}<br><small class="text-gray-400">${roleDisplay}</small>`;

            this.items = [
                {
                    label: displayName,
                    escape: false, // allow HTML in label
                    icon: 'pi pi-user',
                    items: [
                        { separator: true },
                        {
                            label: 'الملف الشخصي',
                            icon: 'pi pi-id-card',
                            command: () => this.router.navigate(['/profile'])
                        },
                        {
                            label: 'تسجيل الخروج',
                            icon: 'pi pi-sign-out',
                            command: () => this.logout()
                        }
                    ]
                }
            ];
        }).catch(error => {
            console.error('فشل في جلب بيانات المستخدم:', error);
        });
    }

}
