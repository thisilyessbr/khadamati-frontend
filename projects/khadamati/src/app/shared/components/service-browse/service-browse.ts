import {Component, inject, OnInit, DestroyRef, ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {ServiceCategory, ServiceFacade} from '@core/services/service.facade';
import {ServiceResponseDTO} from '@api/model/serviceResponseDTO';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-service-browse',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatChipsModule,
  ],
  templateUrl: './service-browse.html',
  styleUrl: './service-browse.scss',
})
export class ServiceBrowse implements OnInit{


  private facade = inject(ServiceFacade);
  private destroy = inject(DestroyRef);
  private cdr     = inject(ChangeDetectorRef);

  services : ServiceResponseDTO[] = [];
  loading = false;
  errorMsg ='';

  readonly  categories: ServiceCategory[] = [
    'PLUMBING', 'ELECTRICITY', 'CLEANING', 'PAINTING', 'CARPENTRY',
    'MOVING', 'GARDENING', 'AC_REPAIR', 'APPLIANCE_REPAIR',
    'SECURITY', 'DESIGN', 'WEB_DEVELOPMENT', 'MOBILE_DEVELOPMENT',
  ];

  categoryControl = new FormControl<ServiceCategory | null>(null);
  cityControl = new FormControl<string>('');

  ngOnInit(): void {
   this.load();

   this.categoryControl.valueChanges.pipe(
     takeUntilDestroyed(this.destroy),
   ).subscribe(() => this.load());

    this.cityControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroy),
    ).subscribe(() => this.load());

  }


  load(): void {
    this.loading  = true;
    this.errorMsg = '';

    const category = this.categoryControl.value ?? undefined;
    const city     = this.cityControl.value?.trim() || undefined;

    this.facade.browse(category, city).subscribe({
      next: services => {
        console.log('GOT:', services);
        this.services = services ?? [];
        this.loading  = false;
        this.cdr.detectChanges();  // ← force view update
      },
      error: (err) => {
        console.error('ERR:', err);
        this.errorMsg = 'Failed to load services.';
        this.loading  = false;
        this.cdr.detectChanges();  // ← force view update
      }
    });
  }

  clearFilters(): void {
    this.categoryControl.setValue(null);
    this.cityControl.setValue('');
  }

  getImageUrl(service: ServiceResponseDTO): string {
    const firstId = service.imageIds?.[0];
    return firstId != null
      ? this.facade.getImageUrl(firstId)
      : 'assets/images/service-placeholder.png';
  }

  formatCategory(cat: string): string {
    return cat.replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  formatBudget(budget?: number): string {
    if (budget == null) return 'N/A';
    return new Intl.NumberFormat('en-MA', {
      style: 'currency', currency: 'MAD', maximumFractionDigits: 0,
    }).format(budget);
  }



}
