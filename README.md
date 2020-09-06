# babel-plugin-transform-html-css-import-require-to-string

Turn HTML and CSSimports and requires into string vars. Make your transpiled code as verbose as this package name!

Inspired by https://github.com/sampsonjoliver/babel-plugin-transform-html-import-require-to-string

## Example

Given a file `assets/template.html`
```html
<h1>Hello</h1>
```

and `assets/my.css`
```css
body { color: red; }
```

Transform your imports
```js
import template from "/assets/template.html"
import styles from "/assets/my.css"
const requiredTemplate = require("/assets/template.html)
const requiredStyles = require("/assets/my.css)
```
to
```js
const template = "<h1>Hello</h1>"
const styles = "body { color: red; }"
const requiredTemplate = "<h1>Hello</h1>"
const requriedStyles = "body { color: red; }"
```

## Installation
Install with your package manager of choice
```
yarn add babel-plugin-transform-html-css-import-require-to-string
```

Then use as per usual...

### Via `.babelrc`
```json
{
  "plugins": ["transform-html-css-import-require-to-string"]
}
```

### Via CLI
```
$ babel --plugins transform-html-css-import-require-to-string script
```

### Via Node API
```js
require("babel-core").transform("code", {
  plugins: ["transform-html-css-import-require-to-string"]
});
```