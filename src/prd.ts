/**
 * The pseudo-random distribution refers to a statistical mechanic
 * of how certain probability-based events work.
 * Under a conditional distribution, the event's chance increases every time the event does not occur,
 * but is lower in the first place as compensation. This results in the effects
 * occurring with a lower variance, meaning the proc chance occurs in a narrow band,
 * and operating under a concave distribution, meaning the proc chance has a highest point.
 *
 * The probability of an effect to occur (or proc) on the N-th test since the last successful proc
 * is given by P(N) = C * N . For each instance which could trigger the effect but does not,
 * the PRD augments the probability of the effect happening for the next instance by a constant C.
 * This constant, which is also the initial probability, is lower than the listed probability
 * of the effect it is shadowing.
 * Once the effect occurs, the counter is reset.
 *
 * For more info:
 * @see https://dota2.fandom.com/wiki/Random_Distribution
 * @see https://gaming.stackexchange.com/questions/161430/calculating-the-constant-c-in-dota-2-pseudo-random-distribution
 *
 */
export default class PrdRng {
	private _percentage: number;
	private _coeff: number;
	private _percNow: number;

	/**
	 * Create a pseudo-random distribution event instance with given percentage.
	 * @param {number} perc - Nominal percentage value.
	 */
	constructor(perc: number) {
		if (isNaN(perc)) throw new Error(`Percentage argument is not a number`);
		if (perc < 0 || perc > 100) throw new Error(`Percentage argument must be between 0 and 100`);
		this._percentage = perc;
		this._coeff = this.cFromP(this._percentage);
		this._percNow = this.coeff;
	}

	/**
	 * @returns {number} GET base percentage value.
	 */
	public get percentage(): number {
		return this._percentage;
	}

	/**
	 * @returns {number} GET pseudo-random coefficient.
	 */
	public get coeff(): number {
		return this._coeff;
	}

	/**
	 * @param {number} perc - SET current percentage value.
	 *                        Limit between 0 and 100.
	 */
	private set percNow(perc: number) {
		if (perc < 0) perc = 0;
		if (perc > 100) perc = 100;
		this._percNow = perc;
	}

	/**
	 * Run event and modify current percentage depending on the result.
	 * Returns result of the event roll.
	 *
	 * @returns {boolean}
	 */
	public run(): boolean {
		let success: boolean = this.roll();
		this.percNow = success ? this._coeff : this._percNow + this._coeff;

		return success;
	}

	/**
	 * Test random event against current percentage parameter.
	 *
	 * @returns {boolean}
	 */
	private roll(): boolean {
		return this.getRandomInt(0, 100) <= this._percNow;
	}

	/**
	 * Return a random number in given interval.
	 *
	 * @param floor - Min number obtainable.
	 * @param ceiling - Max number obtainable.
	 * @returns {number}
	 */
	private getRandomInt(floor: number, ceiling: number): number {
		return Math.random() * (ceiling - floor) + floor;
	}

	/**
	 * Find coefficient C for prd algorithm from DotA.
	 * Coefficient is fixed to 4 decimal numbers maximum.
	 *
	 * @param p - Original percentage.
	 * @returns {number}
	 */
	private cFromP(p: number): number {
		p /= 100;
		let cUpper: number = p;
		let cLower: number = 0;
		let cMid: number;
		let p1: number = 0;
		let p2: number = 1;
		while (true) {
			cMid = (cUpper + cLower) / 2;
			p1 = this.cFromCMid(cMid);
			if (Math.abs(p1 - p2) <= 0) break;
			if (p1 > p) cUpper = cMid;
			else cLower = cMid;
			p2 = p1;
		}

		return cMid * 100;
	}

	/**
	 * Obtain new plausible coefficient from the current one.
	 *
	 * @param CMid - Current coefficient candidate.
	 * @returns {number}
	 */
	private cFromCMid(c: number): number {
		let pProcOnN: number = 0;
		let pProcByN: number = 0;
		let sumNpProcOnN: number = 0;

		let maxFails: number = Math.ceil(1 / c);
		for (let i: number = 1; i <= maxFails; i++) {
			pProcOnN = Math.min(1, i * c) * (1 - pProcByN);
			pProcByN += pProcOnN;
			sumNpProcOnN += i * pProcOnN;
		}

		return 1 / sumNpProcOnN;
	}
}
