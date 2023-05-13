const generateTicket = function () {
    let nodes = [];
    const numberOfTicketsPerSet = 6;
    const numberOfColumns = 9;
    const numberOfRows = 3;

    for (let i = 0; i < numberOfTicketsPerSet; i++) {
        nodes.push(new Node());
    }
    let columns = [
        [01, 02, 03, 04, 05, 06, 07, 08, 09],
        [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
        [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
        [40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
        [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
        [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
        [70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
        [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]
    ];

    let sets = [
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], [], []]
    ];

    for (let i = 0; i < numberOfColumns; i++) {
        let li = columns[i];
        for (let j = 0; j < numberOfTicketsPerSet; j++) {
            let randNumIndex = getRandom(0, li.length - 1);
            let randNum = li.splice(randNumIndex, 1)[0];
            let set = sets[j][i];
            set.push(randNum);
        }
    }

    let lastCol = columns[8];
    let randNumIndex = getRandom(0, lastCol.length - 1);
    let randNum = lastCol.splice(randNumIndex, 1)[0];

    let randSetIndex = getRandom(0, sets.length - 1);
    let randSet = sets[randSetIndex][8];
    randSet.push(randNum);

    for (let pass = 0; pass < numberOfRows; pass++) {
        for (let i = 0; i < numberOfColumns; i++) {
            let col = columns[i];
            if (col.length == 0) continue;

            let randNumIndex_p = getRandom(0, col.length - 1);
            let randNum_p = col[randNumIndex_p];

            let vacantSetFound = false;
            while (!vacantSetFound) {
                let randSetIndex_p = getRandom(0, sets.length - 1);
                let randSet_p = sets[randSetIndex_p];

                if (
                    getNumberOfElementsInSet(randSet_p) == 15 ||
                    randSet_p[i].length == 2
                )
                    continue;

                vacantSetFound = true;
                randSet_p[i].push(randNum_p);

                col.splice(randNumIndex_p, 1);
            }
        }
    }

    // one more pass over the remaining columns
    for (let i = 0; i < numberOfColumns; i++) {
        let col = columns[i];
        if (col.length == 0) continue;

        let randNumIndex_p = getRandom(0, col.length - 1);
        let randNum_p = col[randNumIndex_p];

        let vacantSetFound = false;
        while (!vacantSetFound) {
            let randSetIndex_p = getRandom(0, sets.length - 1);
            let randSet_p = sets[randSetIndex_p];

            if (
                getNumberOfElementsInSet(randSet_p) == 15 ||
                randSet_p[i].length == 3
            )
                continue;

            vacantSetFound = true;
            randSet_p[i].push(randNum_p);

            col.splice(randNumIndex_p, 1);
        }
    }

    // sort the internal sets
    for (let i = 0; i < numberOfTicketsPerSet; i++) {
        for (let j = 0; j < numberOfColumns; j++) {
            sets[i][j].sort();
        }
    }

    //got the sets - need to arrange in tickets now
    for (let setIndex = 0; setIndex < numberOfTicketsPerSet; setIndex++) {
        let currSet = sets[setIndex];
        let currTicket = nodes[setIndex];

        // fill first row
        for (let size = numberOfRows; size > 0; size--) {
            if (currTicket.getRowCount(0) == 5) break;
            for (let colIndex = 0; colIndex < numberOfColumns; colIndex++) {
                if (currTicket.getRowCount(0) == 5) break;
                if (currTicket.get(0, colIndex) != 0) continue;

                let currSetCol = currSet[colIndex];
                if (currSetCol.length != size) continue;

                currTicket.set(0, colIndex, currSetCol.splice(0, 1)[0]);
            }
        }

        // fill second row
        for (let size = numberOfRows - 1; size > 0; size--) {
            if (currTicket.getRowCount(1) == 5) break;
            for (let colIndex = 0; colIndex < numberOfColumns; colIndex++) {
                if (currTicket.getRowCount(1) == 5) break;
                if (currTicket.get(1, colIndex) != 0) continue;

                let currSetCol = currSet[colIndex];
                if (currSetCol.length != size) continue;
                currTicket.set(1, colIndex, currSetCol.splice(0, 1)[0]);
            }
        }

        // fill third row
        for (let size = numberOfRows - 2; size > 0; size--) {
            if (currTicket.getRowCount(2) == 5) break;
            for (let colIndex = 0; colIndex < numberOfColumns; colIndex++) {
                if (currTicket.getRowCount(2) == 5) break;
                if (currTicket.get(2, colIndex) != 0) continue;

                let currSetCol = currSet[colIndex];
                if (currSetCol.length != size) continue;
                currTicket.set(2, colIndex, currSetCol.splice(0, 1)[0]);
            }
        }
    }

    return nodes.map((node) => node.getArray());
};

class Node {
    #A;
    #numberOfRows;
    #numberOfColumns;
    constructor() {
        this.#numberOfColumns = 9;
        this.#numberOfRows = 3;
        this.#A = Array.from({ length: this.#numberOfRows }, () =>
            Array(this.#numberOfColumns).fill(0)
        );
    }

    getArray() {
        return this.#A.map((row) => [...row]);
    }

    get(row, col) {
        if (row < 0 || row > this.#numberOfRows) {
            throw new Error("Invalid row number");
        }
        if (col < 0 || col > this.#numberOfColumns) {
            throw new Error("Invalid column number");
        }
        return this.#A[row][col];
    }

    set(row, col, value) {
        if (row < 0 || row > this.#numberOfRows) {
            throw new Error("Invalid row number");
        }
        if (col < 0 || col > this.#numberOfColumns) {
            throw new Error("Invalid column number");
        }
        this.#A[row][col] = value;
    }

    getRowCount(row) {
        let count = 0;
        for (let value of this.#A[row]) {
            if (value != 0) {
                count++;
            }
        }
        return count;
    }

    getColumnCount(col) {
        let count = 0;
        for (let r = 0; r < this.#numberOfRows; r++) {
            if (this.#A[r][col] != 0) {
                count++;
            }
        }
        return count;
    }

    getFirstEmptyCellInColumn(col) {
        let cellIndex = -1;
        for (let r = 0; r < this.#numberOfRows; r++) {
            if (this.#A[r][col] == 0) {
                cellIndex = r;
                break;
            }
        }
        return cellIndex;
    }

    toString() {
        return this.#A.map((row) => row.join(", ")).join("\n");
    }
}

function getRandom(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
}

function getNumberOfElementsInSet(set) {
    let count = 0;
    for (let list of set) {
        count += list.length;
    }
    return count;
}

module.exports = generateTicket;
