# Copy Indented Code Blocks

An Obsidian plugin that lets you copy indented code blocks as if they're not indented, preserving the ability to fold the code blocks in lists.

## Why I made this

In Obsidian, when you copy a code block that has leading indentation, the copied content will include that indentation. This can be annoying when you want to paste the code elsewhere, like into a command line. (No one likes deleting leading spaces inside a terminal command.)

Most of the time, the answer is to just not indent code blocks, but what if you want to be able to fold the entire code block nicely inside a list?

I couldn't find any other plugins that simply excluded the code block's indentation from the copying functionality, so I made one.

## How it works

🔴🔴(note: see the section on indented code blocks at the end)🔴🔴

When you copy a code block using the built-in copy functionality (clicking on the text or icon in the top right corner of your code block), this plugin will:

- Automatically detect the indentation level of the code block
- From your clipboard content, remove exactly that amount of leading whitespace from each line
- Preserve all other relative indentation within the code

It works with:

- Any indentation style (spaces or tabs)
- Code blocks bounded by more than 3 backticks (should work anywhere you can natively copy a code block)
  - Code blocks with other code blocks nested in them (although, per default Obsidian functionality you'll only be able to copy the whole containing block)

I hope this adds some ease to the document organization you want!

## Example

**Before (indented code block):**

- A list item\*

````
    ```javascript
    function hello() {
        console.log("Hello, world!");
    }
    ```
````

**What you'll paste in default Obsidian:**

```
    function hello() {
        console.log("Hello, world!");
    }
```

**What you'll paste with this plugin:**

```
function hello() {
    console.log("Hello, world!");
}
```

## 🔴QUICK NOTE ABOUT INDENTED CODE BLOCKS:

Indented code blocks _only_ seem to render as such when _directly underneath_ a list item (bullet, checkbox, number). If simply indented, they won't. For example:

Normal code block:

```
foo
```

Indented code block, even with text directly above it (yes, even indented text):
`
	boo
	`

- Indented code block right after a list item:
  `
	woohoo
	`
  Numbers and checkboxes work too. In fact, it even seems to work even if there are blank empty unindented newlines between the list item and the indented code block. (Since folding code blocks inside lists is the use case I needed this for, I love that this native Obsidian functionality makes it even more flexible for that.)

## Installation

1. Copy the plugin files to your Obsidian vault's `.obsidian/plugins/copy-code-properly/` directory
2. Reload Obsidian
3. Enable the plugin in Settings > Community plugins

## Development

To build the plugin:

```bash
npm install
npm run build
```
