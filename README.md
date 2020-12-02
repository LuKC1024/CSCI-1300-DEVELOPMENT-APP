# README

This React App creates a web application for selecting fruits and vegetables in the setting of an online grocery store. The UI features two tables. The larger table lists all goods and is subject to filtering and sorting. The smaller table aggregate works as a shopping cart.

Internally, this app maintains a big table-shaped data, in which each row describes a kind of goods and its count in the shopping cart. When users interact with the UI, each user interaction is mapped to an editing command (Search `handle` in `App.js`). Each editing command is applied to the current data to generate the next data (Search `editor` and `transition` in `App.js`). Then the editor function applies the `setState` methods to the new data, which subsequently re-render the UI to reflect the data changes.

Here is the purpose of each `.js` files in the code base:

* [index.js](./index.js) glues everything together
* [App.js](./App.js) maintains the central table data and does a few rendering
* [TableViewer.js](./TableViewer.js) implements a table viewer, used for showing the inventory and the shopping cart
