import { matrixSum } from "../util/number-functions";

export default class LifeMatrix {
    static next(arg0: number[][]): any {
      throw new Error('Method not implemented.');
    }

    constructor(private _numbers: number[][]) {

    }
    get numbers() {
        
        return this._numbers;
    }
    next(): number[][] {
        this._numbers =  this._numbers.map((_, index) => this.getNewRow(index))
        return this._numbers
    }
    private getNewRow(index: number): number[] {

        return this._numbers[index].map((_, j) => this.getNewCell(index, j))
    }
    private getNewCell(row: number, column: number): number {
        const cell = this._numbers[row][column]
        const partialMatrix = this.partialMatrix(row, column)
        const sum = matrixSum(partialMatrix) - cell
        return cell ? getCellFromLive(sum) : getCellFromDead(sum)
    }
    private partialMatrix(row: number, column: number): number[][] {
        const indexStart = !column ? 0 : column - 1; //Math.max(0, column - 1)
        const indexEnd = column === this._numbers[row].length - 1 ? column + 1 : column + 2
        return [row - 1, row, row + 1].map(i => this._numbers[i] ? 
            this._numbers[i].slice(indexStart, indexEnd) : [])
    }
}
    function getCellFromLive(neighbours: number): number {

        return +(neighbours === 2 || neighbours === 3);
    }
    function getCellFromDead(neighbours: number): number {

        return +(neighbours === 3);
    }


    // next(): number[][] {
    //     const copy = JSON.parse(JSON.stringify(this._numbers))
    //     for (let i = 0; i < copy.length; i++) {
    //         for (let j = 0; j < copy[0].length; j++) {
    //             copy[i][j] = this.getNewNumber(i, j, copy.length)
    //         }
    //     }
    //     this._numbers = copy;
    //     return this._numbers
    // }
    // private getNewNumber(i: number, j: number, length: number) {                     
    //     const neighboursInRow: (number | undefined)[] = [this._numbers[i][j - 1], this._numbers[i][j + 1]]
    //     const neighboursAbove: (number | undefined)[] = []
    //     if (i > 0) {
    //         neighboursAbove.push(this._numbers[i - 1][j - 1], this._numbers[i - 1][j], this._numbers[i - 1][j + 1])
    //     }
    //     const neighboursBelow: (number | undefined)[] = []
    //     if(i < length - 1) {
    //         neighboursBelow.push(this._numbers[i + 1][j - 1], this._numbers[i + 1][j], this._numbers[i + 1][j + 1])
    //     }

    //     const neighbours: (number | undefined)[] = [...neighboursInRow, ...neighboursAbove, ...neighboursBelow];

    //     const alive: number = neighbours.reduce((res: number, cur) =>  cur ? res + 1 : res, 0)
        
    //     let res: number = 0;
    //     if (this._numbers[i][j] && alive == 2 || alive == 3) {
    //         res = 1;
    //     } else if (!this._numbers[i][j] && alive == 3) {
    //         res = 1;
    //     }
    //     return res;
    // }


// for alive:
// alive < 2 -> dead
// alive == 2 -> live
// alive == 3 -> live
// alive > 3 -> dead

// for dead:
// alive == 3 -> live