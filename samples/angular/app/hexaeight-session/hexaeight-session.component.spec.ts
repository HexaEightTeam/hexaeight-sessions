import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexaeightSessionComponent } from './hexaeight-session.component';

describe('HexaeightSessionComponent', () => {
  let component: HexaeightSessionComponent;
  let fixture: ComponentFixture<HexaeightSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HexaeightSessionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HexaeightSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
