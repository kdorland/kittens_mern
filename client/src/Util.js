function stringArraysEqual(array1, array2) {
    if (!array1 || ! array2) return false;
    let equal = true;
    for (let i = 0; i < array1.length && equal; i++) {
        if (array1[i] !== array2[i]) {
            equal = false;
        }
    }
    return equal;
}


module.exports = {
    stringArraysEqual: stringArraysEqual
};