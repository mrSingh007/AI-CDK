import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiMarkdownComponent } from './markdown';

describe('AiMarkdownComponent', () => {
  function createFixture(content: string): ComponentFixture<AiMarkdownComponent> {
    const fixture = TestBed.createComponent(AiMarkdownComponent);
    fixture.componentRef.setInput('content', content);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AiMarkdownComponent],
    });
  });

  it('renders GFM markdown elements', () => {
    const fixture = createFixture(`# Heading\n\n- Alpha\n- Beta\n\n| Name | Value |\n| --- | --- |\n| One | Two |\n\n\`inline\``);
    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.querySelector('h1')?.textContent?.trim()).toBe('Heading');
    expect(nativeElement.querySelectorAll('li').length).toBe(2);
    expect(nativeElement.querySelector('table')).not.toBeNull();
    expect(nativeElement.querySelector('code')?.textContent?.trim()).toBe('inline');
  });

  it('sanitizes unsafe html from markdown input', () => {
    const fixture = createFixture('<script>window.__xss = true</script>Safe text');
    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.querySelector('script')).toBeNull();
    expect(nativeElement.textContent).toContain('Safe text');
  });

  it('updates rendered output when content changes', () => {
    const fixture = createFixture('First value');
    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.textContent).toContain('First value');

    fixture.componentRef.setInput('content', 'Second value');
    fixture.detectChanges();

    expect(nativeElement.textContent).toContain('Second value');
  });
});
