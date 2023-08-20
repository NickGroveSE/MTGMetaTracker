class DataPoint {

    constructor(year, month, day, meta, price) {
        this.date = new Date(concatenate(year, month, day))
        this.meta = meta
        this.price = price
    }

    get date() {
        return date
    }

    get meta() {
        return meta
    }

    get price() {
        return price
    }

    static concatenate(year, month, day) {
        return year.concat("-", month.concat("-", day))
    }

}

// const d = new Date("2022-03-25");