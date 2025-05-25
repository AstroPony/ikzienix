import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render a header with navbar and brand', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('header.navbar');
    expect(header).toBeTruthy();
    expect(header?.querySelector('.navbar-brand')).toBeTruthy();
    expect(header?.classList).toContain('bg-dark');
  });

  it('should render a main content area', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const main = compiled.querySelector('main.container-fluid');
    expect(main).toBeTruthy();
  });

  it('should render a footer with brand color', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const footer = compiled.querySelector('footer.footer');
    expect(footer).toBeTruthy();
    expect(footer?.classList).toContain('bg-dark');
    expect(footer?.querySelector('.text-cyber-yellow')).toBeTruthy();
  });
});
