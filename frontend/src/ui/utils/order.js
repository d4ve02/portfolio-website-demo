const getOrderedList = (object, order) => {
    const ordered = [];
    if (order) {
        for (let value in order) {
            ordered.push(object[value]);
        }
        return ordered;
    } else {
        for (let property in object) {
            ordered.push(object[property]);
        }
    }
};

export { getOrderedList };
