import {Injectable, NgZone} from '@angular/core';
import {Observable, of, switchMap} from 'rxjs';
import { ServiceRequestControllerService } from '@api/api/service-request-controller.service';
import {ServiceResponseDTO} from '@api/model/serviceResponseDTO';



export type ServiceCategory = NonNullable<Parameters<ServiceRequestControllerService['browse']>[0]>;

@Injectable({ providedIn : 'root'})
export class ServiceFacade {

  constructor(private serviceApi : ServiceRequestControllerService, private zone: NgZone) {}

  browse(category?: ServiceCategory, city?: string): Observable<ServiceResponseDTO[]> {
    return this.serviceApi.browse(category, city).pipe(
      switchMap(result => {
        if (result instanceof Blob) {
          return new Observable<ServiceResponseDTO[]>(observer => {
            const reader = new FileReader();
            reader.onload = () => {
              const data = JSON.parse(reader.result as string);
              this.zone.run(() => {          // ← forces Angular to detect changes
                observer.next(data);
                observer.complete();
              });
            };
            reader.readAsText(result as Blob);
          });
        }
        return of(result as ServiceResponseDTO[]);
      })
    );
  }


  getById(id: number): Observable<ServiceResponseDTO> {
    return this.serviceApi.get(id);
  }

  getImageUrl(imageId: number): string {
    return `/api/images/${imageId}`;
  }
}

