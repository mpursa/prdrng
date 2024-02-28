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
 * @note WARNING! Using a base percentage smaller than 0.04 can lead to very long calculation times
 *       during object creation. The smaller the worse!
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
	 * @param {number} floor - Min number obtainable.
	 * @param {number} ceiling - Max number obtainable.
	 * @returns {number}
	 */
	private getRandomInt(floor: number, ceiling: number): number {
		return Math.random() * (ceiling - floor) + floor;
	}

	/**
	 * Find coefficient C for prd algorithm from DotA.
	 * Coefficient is fixed to 6 decimal numbers maximum.
	 *
	 * @param {number} p - Original percentage.
	 * @returns {number}
	 */
	private cFromP(p: number): number {
		if (BASEC[p] !== undefined) return BASEC[p];

		let cUpper: number = BASEC[Math.ceil(p)] / 100;
		let cLower: number = BASEC[Math.floor(p)] / 100;
		p /= 100;
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
	 * @param {number} c - Current coefficient candidate.
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

/**
 * Pre calculated values for integers, for faster
 * coefficient calculation on construction.
 */
const BASEC: number[] = [
	0, // 0
	0.015604169167720937, // 1
	0.06200876164358948, // 2
	0.1386177720390883, // 3
	0.2448555471647783, // 4
	0.3801658303553155, // 5
	0.5440108614899369, // 6
	0.73587052890401, // 7
	0.9552415696806041, // 8
	1.2016368150795191, // 9
	1.474584478107266, // 10
	1.7736274804569137, // 11
	2.0983228162532135, // 12
	2.448240950228553, // 13
	2.8229652481287912, // 14
	3.222091437308764, // 15
	3.645227095623867, // 16
	4.091991166860266, // 17
	4.562013501080302, // 18
	5.054934418517177, // 19
	5.570404294978182, // 20
	6.108083171449882, // 21
	6.667640362150809, // 22
	7.248754339844679, // 23
	7.851112066400392, // 24
	8.474409185231705, // 25
	9.118346091312295, // 26
	9.782638048546705, // 27
	10.467022737491504, // 28
	11.171175824210339, // 29
	11.894919272540397, // 30
	12.63793161208354, // 31
	13.40008645349125, // 32
	14.180519568675281, // 33
	14.98100879493791, // 34
	15.798309812574708, // 35
	16.632877680643805, // 36
	17.49092435951355, // 37
	18.36246523722509, // 38
	19.2485957970884, // 39
	20.154741360775407, // 40
	21.09200313959977, // 41
	22.03645774003488, // 42
	22.989867636265352, // 43
	23.95401522844584, // 44
	24.930699844016324, // 45
	25.98723505886278, // 46
	27.045293670119385, // 47
	28.100763520154636, // 48
	29.155226664271815, // 49
	30.210302534874202, // 50
	31.26766393399555, // 51
	32.3290547144763, // 52
	33.4119960942593, // 53
	34.73699930849593, // 54
	36.03978509331689, // 55
	37.32168294719914, // 56
	38.583961178195445, // 57
	39.82783321856845, // 58
	41.05446351769762, // 59
	42.264973081037425, // 60
	43.46044471809662, // 61
	44.641928058933836, // 62
	45.81044439647124, // 63
	46.96699141100894, // 64
	48.112547833722914, // 65
	49.248078107744774, // 66
	50.74626865671645, // 67
	52.94117647058827, // 68
	55.072463768115966, // 69
	57.14285714285715, // 70
	59.15492957746478, // 71
	61.111111111111114, // 72
	63.01369863013699, // 73
	64.86486486486487, // 74
	66.66666666666667, // 75
	68.42105263157896, // 76
	70.12987012987013, // 77
	71.79487179487181, // 78
	73.41772151898735, // 79
	75.00000000000003, // 80
	76.54320987654322, // 81
	78.04878048780488, // 82
	79.51807228915662, // 83
	80.95238095238095, // 84
	82.35294117647058, // 85
	83.72093023255815, // 86
	85.0574712643678, // 87
	86.36363636363636, // 88
	87.64044943820225, // 89
	88.8888888888889, // 90
	90.10989010989012, // 91
	91.30434782608697, // 92
	92.47311827956992, // 93
	93.61702127659574, // 94
	94.73684210526315, // 95
	95.83333333333334, // 96
	96.90721649484534, // 97
	97.9591836734694, // 98
	98.98989898989899, // 99
	100, // 100
];
