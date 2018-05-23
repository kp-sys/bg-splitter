# Angular pane splitter

Simple pane splitter for angular.js 

## Install via npm

npm i bg-splitter

## Sample

HTML:
```html
<bg-splitter orientation="horizontal">
	<bg-pane min-size="100">Pane 1</bg-pane>
	<bg-pane min-size="150">
	  <bg-splitter orientation="vertical">
	    <bg-pane min-size="50">Pane 2</bg-pane>
	    <bg-pane min-size="50">Pane 3</bg-pane>
	  </bg-splitter>
	</bg-pane>
</bg-splitter>
```

Javascript:
```javascript
var app = angular.module('myApp', ['bgDirectives']);
```

Optionally you can set styles for split handler element with attribute:
```html
<bg-splitter orientation="vertical"
						 handler-style="{
							'background': '#bbb',
              'width': '60px',
              'margin-left': '-30px',
              'height': '10px',
              'margin-top': '-4px'
             }">
	<bg-pane min-size="50">Pane 1</bg-pane>
	<bg-pane min-size="50">Pane 2</bg-pane>
</bg-splitter>
```

## Licence

Code licensed under MIT license.

## Note

It was forked from https://github.com/blackgate/bg-splitter. Author no longer maintain this project.