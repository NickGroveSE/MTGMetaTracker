class DataPoint {

    constructor(date, meta, price) {
        this.date = date
        this.meta = meta
        this.price = price
    }

    set date(d) {
        this._date = d
    }

    set meta(m) {
        this._meta = m
    }

    set price(p) {
        this._price = p
    }

    get date() {
        return this._date
    }

    get meta() {
        return this._meta
    }

    get price() {
        return this._price
    }

}

module.exports = DataPoint

