import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

/**
 * Payload emitted when the user submits chat text and optional attachments.
 */
export interface AiChatTextInputSubmitPayload {
  readonly text: string;
  readonly files: FileList;
}

let nextChatTextInputId = 0;

@Component({
  selector: 'ai-chat-text-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ai-chat-text-input-host',
  },
  templateUrl: './chat-text-input.html',
  styleUrl: './chat-text-input.scss',
})
export class AiChatTextInputComponent {
  private readonly maxTextareaRows = 12;
  private readonly instanceId = nextChatTextInputId++;

  /**
   * Stable id for the textarea element.
   */
  readonly textareaId = `ai-chat-text-input-textarea-${this.instanceId}`;

  /**
   * Input: Placeholder text displayed inside the textarea.
   * Accepted values: string
   * Default: 'Type a message...'
   */
  readonly placeholder = input('Type a message...');

  /**
   * Input: Disables typing, upload, and send interactions.
   * Accepted values: boolean
   * Default: false
   */
  readonly disabled = input(false, { transform: booleanAttribute });

  /**
   * Input: Accepted file formats for upload input.
   * Accepted values: string[] | null (for example: ['.pdf', '.png'] or ['application/pdf'] or ['*'])
   * Default: null
   */
  readonly acceptFileFormats = input<string[] | null>(null);

  /**
   * Input: Enables multi-file selection in the file picker.
   * Accepted values: boolean
   * Default: false
   */
  readonly allowMultipleFiles = input(false, { transform: booleanAttribute });

  /**
   * Input: Accessible label for the send button.
   * Accepted values: string
   * Default: 'Send message'
   */
  readonly sendAriaLabel = input('Send message');

  /**
   * Input: Accessible label for the upload button.
   * Accepted values: string
   * Default: 'Upload file'
   */
  readonly uploadAriaLabel = input('Upload file');

  /**
   * Output: Fired when send is triggered with non-empty text.
   * Payload: `AiChatTextInputSubmitPayload`
   * Trigger: Send button click or Enter key press without Shift.
   */
  readonly submitted = output<AiChatTextInputSubmitPayload>();

  readonly fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInputRef');
  readonly textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textareaRef');

  readonly draftText = signal('');
  readonly selectedFiles = signal<FileList>(this.createEmptyFileList());

  readonly showUploadButton = computed(() => this.acceptFileFormats() !== null);
  readonly fileInputAccept = computed(() => {
    const formats = this.acceptFileFormats();
    if (formats === null) {
      return null;
    }

    const normalizedFormats = formats.map((format) => format.trim()).filter((format) => format.length > 0);
    if (normalizedFormats.includes('*')) {
      return null;
    }

    return normalizedFormats.length > 0 ? normalizedFormats.join(',') : null;
  });
  readonly selectedFileCount = computed(() => this.selectedFiles().length);
  readonly canSubmit = computed(() => !this.disabled() && this.draftText().trim().length > 0);
  readonly selectedFileSummary = computed(() => {
    const count = this.selectedFileCount();
    if (count === 0) {
      return '';
    }

    if (count === 1) {
      const first = this.selectedFiles().item(0);
      return first ? first.name : '1 file selected';
    }

    return `${count} files selected`;
  });

  constructor() {
    effect(() => {
      this.draftText();
      const textarea = this.textareaRef()?.nativeElement;
      if (!textarea) {
        return;
      }

      this.resizeTextarea(textarea);
    });

    effect(() => {
      if (this.acceptFileFormats() === null) {
        this.clearSelectedFiles();
      }
    });
  }

  /**
   * Updates the current message draft from textarea input events.
   *
   * @param event Native textarea input event.
   * @returns Void. Stores latest textarea value in `draftText`.
   */
  onTextInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.draftText.set(textarea.value);
  }

  /**
   * Handles Enter/Shift+Enter behavior for chat-style submit interactions.
   *
   * @param event Native keyboard event from the textarea.
   * @returns Void. Submits on Enter without Shift and preserves newline on Shift+Enter.
   */
  onTextareaKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    this.submitCurrentDraft();
  }

  /**
   * Opens the device file picker when upload is available and enabled.
   *
   * @returns Void. Triggers hidden file input click.
   */
  onUploadClick(): void {
    if (this.disabled() || !this.showUploadButton()) {
      return;
    }

    this.fileInputRef()?.nativeElement.click();
  }

  /**
   * Stores selected files from hidden file input change events.
   *
   * @param event Native file input change event.
   * @returns Void. Updates `selectedFiles` with current file selection.
   */
  onFileSelectionChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    this.selectedFiles.set(inputElement?.files ?? this.createEmptyFileList());
  }

  /**
   * Sends the current draft when the send button is activated.
   *
   * @returns Void. Delegates to `submitCurrentDraft`.
   */
  onSendClick(): void {
    this.submitCurrentDraft();
  }

  /**
   * Emits the submit payload when input constraints are satisfied.
   *
   * @returns Void. Emits `submitted` and resets text/files after success.
   */
  submitCurrentDraft(): void {
    if (!this.canSubmit()) {
      return;
    }

    const payload: AiChatTextInputSubmitPayload = {
      text: this.draftText().trim(),
      files: this.cloneFileList(this.selectedFiles()),
    };

    this.submitted.emit(payload);
    this.draftText.set('');
    this.clearSelectedFiles();
  }

  /**
   * Resets currently selected files and clears the hidden file input value.
   *
   * @returns Void. Sets `selectedFiles` to an empty `FileList`.
   */
  private clearSelectedFiles(): void {
    this.selectedFiles.set(this.createEmptyFileList());

    const inputElement = this.fileInputRef()?.nativeElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }

  /**
   * Creates an empty `FileList` for deterministic payload contracts.
   *
   * @returns Empty `FileList` instance.
   */
  private createEmptyFileList(): FileList {
    if (typeof document !== 'undefined') {
      const inputElement = document.createElement('input');
      inputElement.type = 'file';
      if (inputElement.files) {
        return inputElement.files;
      }
    }

    if (typeof DataTransfer !== 'undefined') {
      return new DataTransfer().files;
    }

    return [] as unknown as FileList;
  }

  /**
   * Creates a stable copy of a `FileList` before local state is cleared.
   *
   * @param files Source file list to clone.
   * @returns Cloned `FileList` when possible; otherwise the original reference.
   */
  private cloneFileList(files: FileList): FileList {
    if (typeof DataTransfer === 'undefined') {
      return files;
    }

    const dataTransfer = new DataTransfer();
    for (const file of files) {
      dataTransfer.items.add(file);
    }

    return dataTransfer.files;
  }

  /**
   * Resizes the textarea to fit content up to a fixed row cap.
   *
   * @param textarea Native textarea element to resize.
   * @returns Void. Updates inline height and overflow behavior.
   */
  private resizeTextarea(textarea: HTMLTextAreaElement): void {
    const computedStyle = getComputedStyle(textarea);
    const lineHeight = this.parsePixelValue(computedStyle.lineHeight);
    if (lineHeight === 0) {
      textarea.style.height = 'auto';
      textarea.style.overflowY = 'hidden';
      return;
    }

    const verticalPadding =
      this.parsePixelValue(computedStyle.paddingTop) + this.parsePixelValue(computedStyle.paddingBottom);
    const verticalBorder =
      this.parsePixelValue(computedStyle.borderTopWidth) +
      this.parsePixelValue(computedStyle.borderBottomWidth);
    const maxHeight = lineHeight * this.maxTextareaRows + verticalPadding + verticalBorder;

    textarea.style.height = 'auto';
    const nextHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }

  /**
   * Parses a CSS pixel value into a finite number.
   *
   * @param value CSS value string.
   * @returns Parsed pixel value or `0` when value is invalid.
   */
  private parsePixelValue(value: string): number {
    const parsedValue = Number.parseFloat(value);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }
}
