<h1>Pseudo random distribution event calculator</h1>

## Install

First run

```bash
npm install prdrng --save
```
then

```javascript
import PrdRng from 'prdrng';

// Set the probability percentage in the constructor.
// In this example case, set it to 25%.
const event = new PrdRng(25);
// Run event as many times as necessary by calling run().
// The probabilities of success average out so that, 
// over a moderate amount, the success rate will be 25%.
let success: boolean = event.run();
// The percentage coefficient is automatically updated inside of PrdRng.run().
  
```

## More info on pseudo-random distibution

<a href="https://dota2.fandom.com/wiki/Random_Distribution">DOTA 2 wiki</a>
