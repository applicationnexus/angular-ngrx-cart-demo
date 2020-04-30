import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private formRefreshAnnouncedSource = new Subject();
  formRefreshSource$ = this.formRefreshAnnouncedSource.asObservable();
  constructor() {}

  publishRefresh() {
    this.formRefreshAnnouncedSource.next();
  }
}
