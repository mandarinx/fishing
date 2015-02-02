Math.seededRandom = function(min, max) {
    min = min || 0;
    max = max || 1;

    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    return min + (Math.seed / 233280) * (max - min);
}

Array.prototype.next = function() {
    if (typeof this.__counter === 'undefined') {
        this.__counter = -1;
    }

    this.__counter++;

    if (this.__counter < this.length) {
        return this[this.__counter];
    }

    return null;
}

Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}
