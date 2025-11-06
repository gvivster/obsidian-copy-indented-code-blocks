// Test script for the indentation processing logic

function processIndentedCode(text) {
	const lines = text.split('\n');

	// Find the minimum indentation level (excluding empty lines)
	let minIndent = Infinity;
	let hasIndentedLines = false;

	for (const line of lines) {
		if (line.trim() === '') continue;

		const indentMatch = line.match(/^(\s*)/);
		if (indentMatch) {
			const indentLength = indentMatch[1].length;
			if (indentLength > 0) {
				hasIndentedLines = true;
				minIndent = Math.min(minIndent, indentLength);
			}
		}
	}

	// If no indented lines found, return original text
	if (!hasIndentedLines || minIndent === Infinity || minIndent === 0) {
		return text;
	}

	// Check if ALL non-empty lines have at least the minimum indentation
	// This ensures we only process consistently indented code blocks
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
		return text; // Don't process inconsistently indented blocks
	}

	// Remove the common indentation from each line
	const processedLines = lines.map(line => {
		if (line.trim() === '') return line; // Keep empty lines as-is
		return line.substring(minIndent);
	});

	return processedLines.join('\n');
}

// Test cases
console.log('=== Test Case 1: 4-space indented code ===');
const test1 = `    function hello() {
        console.log("Hello, world!");
        if (true) {
            console.log("Nested");
        }
    }`;
console.log('Input:');
console.log(test1);
console.log('Output:');
console.log(processIndentedCode(test1));
console.log();

console.log('=== Test Case 2: 2-space indented code ===');
const test2 = `  function hello() {
    console.log("Hello");
  }`;
console.log('Input:');
console.log(test2);
console.log('Output:');
console.log(processIndentedCode(test2));
console.log();

console.log('=== Test Case 3: Tab indented code ===');
const test3 = `\tfunction hello() {\n\t\tconsole.log("Hello");\n\t}`;
console.log('Input:');
console.log(test3);
console.log('Output:');
console.log(processIndentedCode(test3));
console.log();

console.log('=== Test Case 4: Mixed indentation (should not process) ===');
const test4 = `function hello() {
        console.log("Hello");  // 8 spaces
  return;  // 2 spaces
}`;
console.log('Input:');
console.log(test4);
console.log('Output:');
console.log(processIndentedCode(test4));
console.log();

console.log('=== Test Case 5: No indentation ===');
const test5 = `function hello() {
console.log("Hello");
}`;
console.log('Input:');
console.log(test5);
console.log('Output:');
console.log(processIndentedCode(test5));
