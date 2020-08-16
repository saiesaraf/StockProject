module.exports = class portfolioInput {

    constructor(stockName,quantity,purchased_price,current_price) {
        this.stockName=stockName;
        this.quantity=quantity;
        this.purchased_price=purchased_price;
        this.current_price=current_price;
    }
}