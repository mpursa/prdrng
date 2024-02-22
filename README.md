<h1>Pseudo random distribution event calculator</h1>

## Install

First run

```bash
npm install prdrng --save
```

## Usage

```javascript
import PRDEvent from 'prdrng';

let event = new PRDEvent(25);
// Run event as many times as necessary.
// These probabilities average out so that, 
// over a moderate period of time, the success rate will be 25%.
for (let i = 0; i < 1000; i++)
  let success = event.run();
```

## More info on pseudo-random distibution

<a href="https://dota2.fandom.com/wiki/Random_Distribution">DOTA 2 wiki</a>
