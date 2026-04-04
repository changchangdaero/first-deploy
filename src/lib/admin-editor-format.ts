type ApplyWrapFormatParams = {
  content: string;
  selectionStart: number;
  selectionEnd: number;
  prefix: string;
  suffix?: string;
  placeholder: string;
};

export type ApplyWrapFormatResult = {
  nextContent: string;
  nextSelectionStart: number;
  nextSelectionEnd: number;
};

export function applyWrapFormat({
  content,
  selectionStart,
  selectionEnd,
  prefix,
  suffix,
  placeholder,
}: ApplyWrapFormatParams): ApplyWrapFormatResult {
  const resolvedSuffix = suffix ?? prefix;
  const selectedText = content.slice(selectionStart, selectionEnd);
  const targetText = selectedText || placeholder;
  const wrappedText = `${prefix}${targetText}${resolvedSuffix}`;
  const nextContent = `${content.slice(0, selectionStart)}${wrappedText}${content.slice(selectionEnd)}`;
  const innerStart = selectionStart + prefix.length;
  const innerEnd = innerStart + targetText.length;

  return {
    nextContent,
    nextSelectionStart: innerStart,
    nextSelectionEnd: innerEnd,
  };
}

type ApplyLinkFormatParams = {
  content: string;
  selectionStart: number;
  selectionEnd: number;
  textPlaceholder: string;
  url: string;
};

export function applyLinkFormat({
  content,
  selectionStart,
  selectionEnd,
  textPlaceholder,
  url,
}: ApplyLinkFormatParams): ApplyWrapFormatResult {
  const selectedText = content.slice(selectionStart, selectionEnd);
  const linkText = selectedText || textPlaceholder;
  const wrappedText = `[${linkText}](${url})`;
  const nextContent = `${content.slice(0, selectionStart)}${wrappedText}${content.slice(selectionEnd)}`;
  const innerStart = selectionStart + 1;
  const innerEnd = innerStart + linkText.length;

  return {
    nextContent,
    nextSelectionStart: innerStart,
    nextSelectionEnd: innerEnd,
  };
}
