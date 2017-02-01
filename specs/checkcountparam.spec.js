const mocha = require("mocha"),
    chai = require("chai"),
    should = chai.should(),
    checkCountParam = require("../lib/checkcountparam")

describe("checking of querystring for count param", () => {

    //1
    it("does find count param", () => {
        checkCountParam("http://localhost:3000/block?count=true&direction=south&IP=DNT").should.be.equal(true)
    })

    //2
    it("checks only for param key not its value", () => {
        checkCountParam("http://localhost:3000/track?cnout=count").should.be.equal(false)
    })

    //3
    it("handles empty string correctly", () => {
        checkCountParam("http://localhost:3000/store").should.be.equal(false)
    })

})
