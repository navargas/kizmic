# Kizmic: A Sensible Interface

*Keyboard is zen, mouse is chaos.*

Drowning in web consoles? Tired of fade in, hover over, pop-up, slide down, zoom-scale nonsense?
Have you clicked that clicker more than you care to click it? Oh have I got the framework for you.

Kizmic is a web interface intended to keep your hand off that mouse and your eye on that prize.

## Zen
Interactions with a computer are best separated three camps. A user might want to view the actions
that are currently applicable for the current section, change to a different section, or perform
an action. Kizmic limits all interactions to these three categories.

## Usage
Type into a computer keyboard

## Configuration
Each 'page' is defined by an array of objects.

```javascript
var index = [
  {name:"Barber Shop", type:"title", inactive:true},
  {name:"start typing to begin", type:"suggestion"},
  {name:"cut my hair", type:"action", POST:"/haircut"},
  {name:"haircuts", type:"section", link:"haircuts"}
];

var haircuts = [
  {name:"The Bruce Willis", POST:"/moreinfo?style=bwillie", thumbnail:"/res/bruce.jpg"},
  {name:"Statham Style", POST:"/moreinfo?style=drivefast", thumbnail:"/res/statham.jpg"},
  {name:"Larry's David", POST:"/moreinfo?style=prettygood", thumbnail:"/res/ldavid.jpg"}
];
```

These arrays can be used to configure a frontend

```javascript
// Give the id of the target <div> you wish to display kizmic in.
k = new kizmic('#htmlElementId');

// Import the arrays of elements
k.load(index, 'home');
k.load(haircuts, 'haircuts');

// Select an initial view
k.show('home');
```
