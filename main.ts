import { Plugin } from 'obsidian';

export default class CopyIndentedCodeBlocksPlugin extends Plugin {
	async onload() {
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			const target = evt.target as HTMLElement;

			// Check for various copy button selectors that Obsidian might use
			const isCopyButton = target.matches('.copy-code-button') ||
								target.closest('.copy-code-button') ||
								target.matches('.clickable-icon') ||
								target.closest('.clickable-icon') ||
								target.matches('.code-block-flair') ||
								target.closest('.code-block-flair') ||
								(typeof target.className === 'string' && target.className.includes('copy')) ||
								(target.parentElement && typeof target.parentElement.className === 'string' && target.parentElement.className.includes('copy'));

			if (isCopyButton) {
				this.handleCopyClick(evt);
			}
		});
	}

	private handleCopyClick(evt: MouseEvent) {
		const target = evt.target as HTMLElement;

		// Find the line that contains the copy button
		const currentLine = target.closest('.cm-line');

		if (!currentLine) {
			return;
		}

		// Check if this line is part of a code block
		const isCodeBlock = currentLine.classList.contains('HyperMD-codeblock');

		if (!isCodeBlock) {
			return;
		}

		// Find all consecutive lines that are part of this code block
		const codeLines: string[] = [];
		let currentElement = currentLine as Element;

		// Go backwards to find the start of the code block
		while (currentElement) {
			const prevElement = currentElement.previousElementSibling;
			if (!prevElement || !prevElement.classList.contains('HyperMD-codeblock')) {
				break;
			}
			currentElement = prevElement;
		}

		// Now collect all consecutive code block lines
		const startElement = currentElement;

		currentElement = startElement;
		let lineCount = 0;

		while (currentElement && currentElement.classList.contains('HyperMD-codeblock')) {
			const text = currentElement.textContent || '';
			codeLines.push(text);
			lineCount++;

			// Safety check to prevent infinite loops
			if (lineCount > 100) {
				break;
			}

			currentElement = currentElement.nextElementSibling as Element;
		}

		// Filter out the opening and closing backtick lines (first and last lines)
		// Keep all middle lines, even if they contain backticks
		const contentLines = codeLines.slice(1, -1); // Remove first and last lines

		const rawText = contentLines.join('\n');

		// Check if the code block is indented and calculate indentation
		const processedText = this.processIndentedCode(rawText);

		// Copy to clipboard
		navigator.clipboard.writeText(processedText);

		// Prevent default behavior
		evt.preventDefault();
		evt.stopPropagation();
	}

	private processIndentedCode(text: string): string {
		const lines = text.split('\n');

		// Find the minimum indentation level (excluding empty lines)
		let minIndent = Infinity;
		let hasIndentedLines = false;

		for (const line of lines) {
			if (line.trim() === '') continue;
			const indentMatch = line.match(/^(\s*)/);
			if (indentMatch && indentMatch[1].length > 0) {
				hasIndentedLines = true;
				minIndent = Math.min(minIndent, indentMatch[1].length);
			}
		}

		// If no indented lines found, return original text
		if (!hasIndentedLines || minIndent === Infinity || minIndent === 0) {
			return text;
		}

		// Check if ALL non-empty lines have at least the minimum indentation
		let allLinesHaveMinIndent = true;
		for (const line of lines) {
			if (line.trim() === '') continue;
			const indentMatch = line.match(/^(\s*)/);
			if (indentMatch && indentMatch[1].length < minIndent) {
				allLinesHaveMinIndent = false;
				break;
			}
		}

		if (!allLinesHaveMinIndent) {
			return text;
		}

		// Remove the common indentation from each line
		const processedLines = lines.map(line => {
			if (line.trim() === '') return line;
			return line.substring(minIndent);
		});

		return processedLines.join('\n');
	}
}
