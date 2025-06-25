import { GenericTable } from '@/app/shared/components/elements/table/generic-table/generic-table';
import { ComponentFixture, TestBed } from '@angular/core/testing';


describe('GenericTable', () => {
  let component: GenericTable<any>;
  let fixture: ComponentFixture<GenericTable<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericTable]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GenericTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
