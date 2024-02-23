import PrdRng from '../prd';

/**
 * Run a random event 100 million times with
 * pseudo random distribution, then log the result.
 */
function main() {
	let times: number = 100000000;
	let percentage: number = getPercentageFromArguments();

	let timerC: [number, number] = process.hrtime();
	let event: PrdRng = new PrdRng(percentage);
	timerC = process.hrtime(timerC);

	console.log(`Event stated percentage -> ${event.percentage}%`);
	console.log(`Event PRD coefficient -> ${event.coeff}`);
	console.log(`PRD coefficient calculation time -> ${timerC[0]}.${timerC[1]} s`);

	let succInstances: number = 0;
	let timer: [number, number] = process.hrtime();
	for (let i: number = 0; i < times; i++) {
		let success: boolean = event.run();
		succInstances += success ? 1 : 0;
	}
	timer = process.hrtime(timer);
	console.log(`Event has been run ${times} times`);
	console.log(`Effective percentage -> ${((succInstances / times) * 100).toFixed(6)}%`);
	console.log(`Time elapsed -> ${timer[0]}.${timer[1]} s`);
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
