import React from "react";
import { COLLAPSE_CHAR_THRESHOLD, COLLAPSE_LINE_THRESHOLD } from "../constants";

/**
 * Determine whether an assistant message is long enough to offer a
 * non-destructive "Show more" / "Show less" collapse toggle.
 */
export function isLongAssistantMessage(content: string): boolean {
  if (!content) return false;
  if (content.length > COLLAPSE_CHAR_THRESHOLD) return true;
  const nonEmptyLines = content
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  return nonEmptyLines.length > COLLAPSE_LINE_THRESHOLD;
}

/**
 * Build a clean preview slice at line/word boundaries without altering
 * the underlying message stored in state.
 */
export function buildCollapsedPreview(content: string): string {
  const lines = content.split(/\r?\n/);
  const collected: string[] = [];
  let charCount = 0;

  for (const line of lines) {
    if (
      collected.length >= 6 ||
      (charCount + line.length > 360 && collected.length > 0)
    ) {
      break;
    }
    collected.push(line);
    charCount += line.length + 1;
  }

  let preview = collected.join("\n").trim();
  if (preview.length > 380) {
    preview = preview.slice(0, 380).replace(/\s+\S*$/, "");
  }
  return `${preview}…`;
}

/**
 * Strip raw Markdown tables when the same package information is already
 * represented by visual Travel Package Cards.
 */
export function stripDuplicateMarkdownTables(
  content: string,
  fallbackText?: string
): string {
  const lines = content.split(/\r?\n/);
  const hasTable = lines.some((l) => {
    const s = l.trim();
    return s.startsWith("|") && s.endsWith("|") && s.length > 2;
  });
  if (!hasTable) return content;

  const filtered = lines.filter((l) => {
    const s = l.trim();
    return !(s.startsWith("|") && s.endsWith("|") && s.length > 2);
  });

  const cleaned = filtered
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (cleaned.length >= 20) {
    return cleaned;
  }

  return fallbackText || cleaned;
}

/**
 * Render formatted text supporting paragraphs, bullet points, responsive comparison
 * tables (when explicitly requested), and **bold** spans.
 */
export function renderFormattedContent(content: string): React.ReactNode {
  const lines = content.split(/\r?\n/);

  const renderInlineBold = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={idx} className="font-bold text-[#073B50]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      elements.push(<div key={`sp-${i}`} className="h-1" />);
      i++;
      continue;
    }

    // Responsive Markdown comparison table block (used when user explicitly asks for comparison/table)
    if (line.startsWith("|") && line.endsWith("|") && line.length > 2) {
      const tableLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim().startsWith("|") &&
        lines[i].trim().endsWith("|")
      ) {
        tableLines.push(lines[i].trim());
        i++;
      }

      const rows = tableLines
        .filter((tl) => !/^\|[\s\-:|]+\|$/.test(tl))
        .map((tl) =>
          tl
            .slice(1, -1)
            .split("|")
            .map((cell) => cell.trim())
        );

      if (rows.length > 0) {
        const [headerRow, ...bodyRows] = rows;
        elements.push(
          <div
            key={`tbl-${i}`}
            className="my-2 rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-2xs"
          >
            <table className="w-full table-fixed text-[11.5px] sm:text-xs border-collapse">
              <thead>
                <tr className="bg-[#E3F5F6]/70 text-[#073B50] border-b border-[#E2E8F0]">
                  {headerRow.map((cell, cIdx) => (
                    <th
                      key={cIdx}
                      className="px-2 py-1.5 font-bold text-start break-words align-top"
                    >
                      {renderInlineBold(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/60">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#F7FAFC]">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="px-2 py-1.5 align-top break-words leading-snug"
                      >
                        {renderInlineBold(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    const headingMatch = line.match(/^#{1,4}\s+(.*)$/);
    if (headingMatch) {
      elements.push(
        <p key={`hd-${i}`} className="font-bold text-[#073B50] pt-1">
          {renderInlineBold(headingMatch[1])}
        </p>
      );
      i++;
      continue;
    }

    const bulletMatch = line.match(/^([-*•]|\d+[.)])\s+(.*)$/);
    if (bulletMatch) {
      elements.push(
        <div key={`bl-${i}`} className="flex items-start gap-2 ps-1">
          <span className="text-[#0796A5] font-bold select-none mt-0.5">•</span>
          <span className="flex-1">{renderInlineBold(bulletMatch[2])}</span>
        </div>
      );
      i++;
      continue;
    }

    elements.push(<p key={`p-${i}`}>{renderInlineBold(line)}</p>);
    i++;
  }

  return <div className="space-y-1.5 leading-relaxed">{elements}</div>;
}
