import PRDEvent from '../prd';

/**
 * Run a random event 100 million times with pseudo random determination,
 * then log the result.
 */
function main() {
	let percentage: number = getPercentageFromArguments();
	let event: PRDEvent = new PRDEvent(percentage);
	let succInstances: number = 0;
	let timer: [number, number] = process.hrtime();
	for (let i: number = 0; i < 100000000; i++) {
		let success = event.run();
		succInstances += success ? 1 : 0;
	}
	timer = process.hrtime(timer);
	console.log(`Event has been run 100000000 times`);
	console.log(`Event has been successfull ${succInstances} times`);
	console.log(`Event stated percentage was ${event.percentage}%`);
	console.log(`Event PRD coefficient was ${event.coeff.toFixed(15)}`);
	console.log(
		`Event had effective percentage of ${((succInstances / 100000000) * 100).toFixed(4)}%`
	);
	console.log(`Time elapsed is ${timer[0]},${timer[1]} s`);
	process.exit(0);
}

/**
 * Return the percentage given in argument.
 *
 * @returns {number}
 */
function getPercentageFromArguments(): number {
	if (process.argv[2] === undefined) throw new Error(`Percentage argument missing`);
	let givenPerc: number = parseFloat(process.argv[2]);
	if (isNaN(givenPerc)) throw new Error(`Percentage argument is not a number`);
	if (givenPerc < 0 || givenPerc > 100)
		throw new Error(`Percentage argument must be between 0 and 100`);
	return givenPerc;
}

/////////////////////////////////////////////
/////////////////////////////////////////////
main(); //////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
