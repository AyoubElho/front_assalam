import { Component, inject, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from '../../services/service/EventService';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { CreateEventDialogComponent } from './create-event-dialog.component';
import { Card } from 'primeng/card';
import {MatButton, MatIconButton} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
    MatCard,
    NgForOf,
    NgIf,
    DatePipe,
    Card,
    MatIconButton,
    MatIconModule,
    MatMenuItem,
    MatMenu,
    MatMenuTrigger,
    MatButton,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  dialog = inject(MatDialog);
  eventService = inject(EventService);
  private spinner = inject(NgxSpinnerService);

  events: any = [];
  role = localStorage.getItem('role'); // Assuming role is stored as 'role'

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [],
  };

  ngOnInit(): void {
    this.spinner.show();
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAll()
      .then((res) => {
        this.events = res.data;

        this.calendarOptions.events = this.events.map((event: any) => {
          const startDate = new Date(event.start);
          const endDate = new Date(event.end);
          endDate.setDate(endDate.getDate() + 1);

          return {
            title: event.title,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            extendedProps: {
              description: event.description,
              location: event.location,
              creator: event.creator,
            },
            id: event.id,
          };
        });
      })
      .catch((error) => {
        console.error('Failed to load events:', error);
      })
      .finally(() => {
        this.spinner.hide(); // ✅ Always hide spinner after load
      });
  }


  handleDateClick(arg: any) {
    if (this.role !== 'admin' && this.role !== 'super_admin') {
      alert('Only admins can add events.');
      return;
    }

    const dialogRef = this.dialog.open(CreateEventDialogComponent, {
      data: { date: arg.dateStr },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eventService.create(result).then(() => {
          this.loadEvents();
        }).catch((error) => {
          console.error('Error creating event:', error);
          alert('Failed to create event');
        });
      }
    });
  }

  editEvent(event: any) {
    const dialogRef = this.dialog.open(CreateEventDialogComponent, {
      data: {
        date: event.start, // you can use event.start if needed
        event: event, // pass full event
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eventService.update(event.id, result).then(() => {
          this.loadEvents();
        }).catch((error) => {
          console.error('Error updating event:', error);
          alert('Failed to update event');
        });
      }
    });
  }

  deleteEvent(eventId: any) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.delete(eventId).then(() => {
        this.loadEvents();
      }).catch((error) => {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      });
    }
  }
}
