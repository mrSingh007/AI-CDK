import { TestBed } from '@angular/core/testing';
import {
  type AiChatTextInputSubmitPayload,
  AiChatTextInputComponent,
} from './chat-text-input';

function createFileList(files: readonly File[]): FileList {
  if (typeof DataTransfer !== 'undefined') {
    const dataTransfer = new DataTransfer();
    for (const file of files) {
      dataTransfer.items.add(file);
    }

    return dataTransfer.files;
  }

  const fallback: {
    readonly length: number;
    readonly item: (index: number) => File | null;
    readonly [Symbol.iterator]: () => IterableIterator<File>;
    [index: number]: File | number | ((index: number) => File | null) | (() => IterableIterator<File>);
  } = {
    length: files.length,
    item: (index: number) => files[index] ?? null,
    [Symbol.iterator]: function* (): IterableIterator<File> {
      for (const file of files) {
        yield file;
      }
    },
  };

  for (let index = 0; index < files.length; index += 1) {
    fallback[index] = files[index];
  }

  return fallback as unknown as FileList;
}

function setInputFiles(input: HTMLInputElement, files: FileList): void {
  Object.defineProperty(input, 'files', {
    configurable: true,
    value: files,
  });
}

describe('AiChatTextInputComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiChatTextInputComponent],
    }).compileComponents();
  });

  it('disables send for empty/whitespace text and enables for non-empty text', () => {
    const fixture = TestBed.createComponent(AiChatTextInputComponent);
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__textarea',
    ) as HTMLTextAreaElement;
    const sendButton = fixture.nativeElement.querySelector('.ai-chat-text-input__send') as HTMLButtonElement;

    expect(sendButton.disabled).toBe(true);

    textarea.value = '   ';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(sendButton.disabled).toBe(true);

    textarea.value = 'Hello there';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(sendButton.disabled).toBe(false);
  });

  it('emits trimmed text and FileList on submit click', () => {
    const fixture = TestBed.createComponent(AiChatTextInputComponent);
    fixture.componentRef.setInput('acceptFileFormats', ['.txt']);
    fixture.detectChanges();

    const submittedSpy = vi.fn<(payload: AiChatTextInputSubmitPayload) => void>();
    fixture.componentInstance.submitted.subscribe(submittedSpy);

    const textarea = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__textarea',
    ) as HTMLTextAreaElement;
    const fileInput = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__file-input',
    ) as HTMLInputElement;
    const sendButton = fixture.nativeElement.querySelector('.ai-chat-text-input__send') as HTMLButtonElement;

    const fileList = createFileList([new File(['hello'], 'test.txt', { type: 'text/plain' })]);
    setInputFiles(fileInput, fileList);
    fileInput.dispatchEvent(new Event('change'));

    textarea.value = '  ship this  ';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    sendButton.click();

    expect(submittedSpy).toHaveBeenCalledTimes(1);
    const payload = submittedSpy.mock.calls[0][0];
    expect(payload.text).toBe('ship this');
    expect(payload.files.length).toBe(1);
    expect(payload.files.item(0)?.name).toBe('test.txt');
  });

  it('clears text and files after successful submit', () => {
    const fixture = TestBed.createComponent(AiChatTextInputComponent);
    fixture.componentRef.setInput('acceptFileFormats', ['.txt']);
    fixture.detectChanges();

    const submittedSpy = vi.fn<(payload: AiChatTextInputSubmitPayload) => void>();
    fixture.componentInstance.submitted.subscribe(submittedSpy);

    const textarea = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__textarea',
    ) as HTMLTextAreaElement;
    const fileInput = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__file-input',
    ) as HTMLInputElement;

    const fileList = createFileList([new File(['hello'], 'draft.txt', { type: 'text/plain' })]);
    setInputFiles(fileInput, fileList);
    fileInput.dispatchEvent(new Event('change'));

    textarea.value = 'Message';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.componentInstance.onSendClick();
    fixture.detectChanges();

    expect(submittedSpy).toHaveBeenCalledTimes(1);
    expect(textarea.value).toBe('');
    expect(fixture.componentInstance.selectedFileCount()).toBe(0);
  });

  it('hides upload button when acceptFileFormats is null', () => {
    const fixture = TestBed.createComponent(AiChatTextInputComponent);
    fixture.componentRef.setInput('acceptFileFormats', null);
    fixture.detectChanges();

    const uploadButton = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__upload',
    ) as HTMLButtonElement | null;

    expect(uploadButton).toBeNull();
  });

  it('shows upload button and forwards accept attribute when acceptFileFormats is provided', () => {
    const fixture = TestBed.createComponent(AiChatTextInputComponent);
    fixture.componentRef.setInput('acceptFileFormats', ['.png', '.jpg']);
    fixture.detectChanges();

    const uploadButton = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__upload',
    ) as HTMLButtonElement | null;
    const fileInput = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__file-input',
    ) as HTMLInputElement;

    expect(uploadButton).not.toBeNull();
    expect(fileInput.getAttribute('accept')).toBe('.png,.jpg');
  });

  it('applies the configured accessible textarea label', () => {
    const fixture = TestBed.createComponent(AiChatTextInputComponent);
    fixture.componentRef.setInput('textareaAriaLabel', 'Nachricht verfassen');
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__textarea',
    ) as HTMLTextAreaElement;
    const label = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__sr-only',
    ) as HTMLLabelElement;

    expect(label.textContent?.trim()).toBe('Nachricht verfassen');
    expect(label.htmlFor).toBe(textarea.id);
  });

  it('accepts all file types when acceptFileFormats contains wildcard', () => {
    const fixture = TestBed.createComponent(AiChatTextInputComponent);
    fixture.componentRef.setInput('acceptFileFormats', ['*']);
    fixture.detectChanges();

    const uploadButton = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__upload',
    ) as HTMLButtonElement | null;
    const fileInput = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__file-input',
    ) as HTMLInputElement;

    expect(uploadButton).not.toBeNull();
    expect(fileInput.getAttribute('accept')).toBeNull();
  });

  it('toggles file input multiple attribute from allowMultipleFiles', () => {
    const fixture = TestBed.createComponent(AiChatTextInputComponent);
    fixture.componentRef.setInput('allowMultipleFiles', true);
    fixture.detectChanges();

    const fileInput = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__file-input',
    ) as HTMLInputElement;
    expect(fileInput.multiple).toBe(true);

    fixture.componentRef.setInput('allowMultipleFiles', false);
    fixture.detectChanges();

    expect(fileInput.multiple).toBe(false);
  });

  it('triggers hidden file input click when upload button is clicked', () => {
    const fixture = TestBed.createComponent(AiChatTextInputComponent);
    fixture.componentRef.setInput('acceptFileFormats', ['.pdf']);
    fixture.detectChanges();

    const fileInput = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__file-input',
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, 'click');

    const uploadButton = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__upload',
    ) as HTMLButtonElement;
    uploadButton.click();

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('submits on Enter and does not submit on Shift+Enter', () => {
    const fixture = TestBed.createComponent(AiChatTextInputComponent);
    fixture.detectChanges();

    const submittedSpy = vi.fn<(payload: AiChatTextInputSubmitPayload) => void>();
    fixture.componentInstance.submitted.subscribe(submittedSpy);

    const textarea = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__textarea',
    ) as HTMLTextAreaElement;

    textarea.value = 'Keyboard submit';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(submittedSpy).toHaveBeenCalledTimes(1);

    textarea.value = 'Shift enter';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true }));

    expect(submittedSpy).toHaveBeenCalledTimes(1);
  });

  it('does not submit on Enter while IME composition is active', () => {
    const fixture = TestBed.createComponent(AiChatTextInputComponent);
    fixture.detectChanges();

    const submittedSpy = vi.fn<(payload: AiChatTextInputSubmitPayload) => void>();
    fixture.componentInstance.submitted.subscribe(submittedSpy);

    const textarea = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__textarea',
    ) as HTMLTextAreaElement;

    textarea.value = '変換中';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true }));

    expect(submittedSpy).not.toHaveBeenCalled();
  });

  it('auto-resizes textarea and caps growth at 12 rows', () => {
    const fixture = TestBed.createComponent(AiChatTextInputComponent);
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector(
      '.ai-chat-text-input__textarea',
    ) as HTMLTextAreaElement;

    const defaultComputedStyle = window.getComputedStyle(textarea);
    const getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      ...defaultComputedStyle,
      lineHeight: '20px',
      paddingTop: '8px',
      paddingBottom: '8px',
      borderTopWidth: '1px',
      borderBottomWidth: '1px',
    } as CSSStyleDeclaration);

    let scrollHeightValue = 120;
    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      get: () => scrollHeightValue,
    });

    textarea.value = 'Short message';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(textarea.style.height).toBe('120px');
    expect(textarea.style.overflowY).toBe('hidden');

    scrollHeightValue = 400;
    textarea.value = 'Very long message';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(textarea.style.height).toBe('258px');
    expect(textarea.style.overflowY).toBe('auto');

    getComputedStyleSpy.mockRestore();
  });
});
