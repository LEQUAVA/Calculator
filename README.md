# Calculator

A small browser calculator I keep tinkering with. It started as a basic four-function calculator and slowly picked up history, keyboard controls, extra operations, and one unnecessary easter egg.

## Features

- basic arithmetic
- square, square root, reciprocal, percentage, and +/-
- calculation history saved in local storage
- keyboard support
- one-click result copying
- responsive layout for smaller screens
- visible keyboard focus states and improved history controls

## Run it

No build step and no dependencies.

1. Clone or download the repo.
2. Open `index.html` in a browser.
3. Start calculating.

Keyboard shortcuts:

- `0-9` and `.` — enter numbers
- `+ - * /` — operators
- `Enter` or `=` — calculate
- `Backspace` — remove the last digit
- `Escape` — close history, or clear when history is closed

## Files

```text
index.html   page structure
styles.css   layout, colours, responsive styles
app.js       calculator logic, history, keyboard controls
```

## Tiny secret

There is still an easter egg hidden in the number input. I'm leaving the code in the repo, so it is not exactly Fort Knox.

## Things I might add later

- memory buttons
- a cleaner expression display
- proper automated tests
- theme options

Built with plain HTML, CSS, and JavaScript because this project really does not need a framework.
