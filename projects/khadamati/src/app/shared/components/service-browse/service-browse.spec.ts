import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBrowse } from './service-browse';

describe('ServiceBrowse', () => {
  let component: ServiceBrowse;
  let fixture: ComponentFixture<ServiceBrowse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceBrowse],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceBrowse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
