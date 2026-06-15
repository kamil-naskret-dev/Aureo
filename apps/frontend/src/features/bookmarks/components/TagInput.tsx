import { X } from 'lucide-react';
import { ClipboardEvent, KeyboardEvent, useState } from 'react';

const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 50;

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  id?: string;
  'aria-invalid'?: boolean;
};

export const TagInput = ({ value, onChange, id, 'aria-invalid': ariaInvalid }: TagInputProps) => {
  const [input, setInput] = useState('');

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (!tag || tag.length > MAX_TAG_LENGTH) return;
    if (value.includes(tag)) return;
    if (value.length >= MAX_TAGS) return;
    onChange([...value, tag]);
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && input === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (input.trim()) addTag(input);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (!pasted.includes(',')) return;
    e.preventDefault();
    pasted.split(',').forEach((part) => addTag(part));
  };

  return (
    <div
      className={`flex flex-wrap gap-1.5 min-h-10 max-h-32 overflow-y-auto w-full rounded-md border px-3 py-2 text-sm transition-colors
        bg-white dark:bg-custom-neutral-600
        border-custom-neutral-300 dark:border-custom-neutral-500
        focus-within:ring-2 focus-within:ring-custom-primary-700 focus-within:ring-offset-2
        ${ariaInvalid ? 'border-destructive focus-within:ring-destructive' : ''}`}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-custom-neutral-100 dark:bg-custom-neutral-500 px-2 py-0.5 text-xs font-medium text-custom-neutral-800 dark:text-white max-w-[160px]"
          title={tag}
        >
          <span className="truncate">{tag}</span>
          <button
            type="button"
            onClick={() => removeTag(tag)}
            aria-label={`Remove tag ${tag}`}
            className="text-custom-neutral-400 hover:text-custom-neutral-700 dark:hover:text-white rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-custom-primary-700 dark:focus-visible:ring-custom-neutral-100"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}

      {value.length < MAX_TAGS && (
        <input
          id={id}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
          placeholder={value.length === 0 ? 'Type a tag and press Enter...' : ''}
          aria-invalid={ariaInvalid}
          aria-describedby={id ? `${id}-hint` : undefined}
          maxLength={MAX_TAG_LENGTH}
          className="flex-1 min-w-24 bg-transparent outline-none placeholder:text-custom-neutral-400 dark:placeholder:text-custom-neutral-300 text-custom-neutral-900 dark:text-white"
        />
      )}
      {id && (
        <span id={`${id}-hint`} className="sr-only">
          Press Enter or comma to add a tag. Press Backspace to remove the last tag. Maximum{' '}
          {MAX_TAGS} tags.
        </span>
      )}
    </div>
  );
};
