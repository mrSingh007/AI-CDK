import {
  ChangeDetectionStrategy,
  Component,
  SecurityContext,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Marked } from 'marked';

const MARKDOWN_PARSER = new Marked({
  gfm: true,
  breaks: true,
  async: false,
});

@Component({
  selector: 'ai-markdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ai-markdown-host',
  },
  templateUrl: './markdown.html',
  styleUrl: './markdown.scss',
})
export class AiMarkdownComponent {
  private readonly sanitizer = inject(DomSanitizer);

  /**
   * Input: Markdown content rendered to sanitized HTML.
   * Accepted values: string
   * Default: required input
   */
  readonly content = input.required<string>();

  readonly sanitizedHtml = computed(() => {
    const markdownContent = this.content();
    if (!markdownContent) {
      return '';
    }

    const parsedHtml = MARKDOWN_PARSER.parse(markdownContent);
    const html = typeof parsedHtml === 'string' ? parsedHtml : '';
    return this.sanitizer.sanitize(SecurityContext.HTML, html) ?? '';
  });
}
