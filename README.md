# babel-plugin-import-require-as-string

This turns imports and require calls into variable assignements
and string literals, that contain the contents of the imported/required
resources. 

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
const requiredTemplate = require("/assets/template.html")
const requiredStyles = require("/assets/my.css")
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
yarn add babel-plugin-import-require-as-string
```

```
npm i --save-dev babel-plugin-import-require-as-string
```

Then add the plugin to your `.babelrc`. The extensions option defines the file
extensions for which imports or require calls will be converted
into string literals.

```json
{
  "plugins": [
    ["import-require-as-string", {
      "extensions": [".html", ".css"]
    }]
  ]
}
```
