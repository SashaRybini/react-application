const ar = [1,2,3,4]
console.log(ar[-1]);

const matrix = [ [1,2,3],
            [4,5,6],
            [7,8,9] ]

console.log(matrix[1][0]);

const clone = JSON.parse(JSON.stringify(matrix));
// const clone = Object.assign(matrix)

// const clone = [];
// clone.push(...matrix)

// console.log(matrix);
matrix[1][0] = 10;
console.log(clone);
console.log(clone[0][-1]);
console.log(clone[2][3]);