const mocha = require('mocha')
const chai = require('chai'), should = chai.should()
const chaiHttp = require('chai-http')
const httpServer = require('../index.js')

chai.use(chaiHttp)

describe("track route", (done) => {
    const client = require('redis').createClient()
    const rand = Math.round(Math.random()*5000)

    beforeEach((done) => {
        client.set("count", rand, done)
    })

    afterEach((done) => {
        client.exists("count", (err, res) => {
            if (err) done(err);
            else if (res) client.del("count", done);
            else done();
        })
    })

    //1
    it("increments db count key for default usecase", (done) => {
        chai.request(httpServer)
        .post('/track?count=true')
        .end(() => {
            client.get("count", (err, reply) => {
                if (err) done(err);
                else {
                    reply.should.be.equal(rand + 1 + '')
                    done()
                }
            })
        })
    })

    //2
    it("sets up value in redisdb for nil", (done) => {
        client.del("count", () => {
            chai.request(httpServer)
            .post('/track?count=zorro')
            .end(() => {
                client.get("count", (err, reply) => {
                    if (err) done(err);
                    else {
                        reply.should.be.equal('1')
                        done()
                    }
                })
            })
        })
    })

    //3
    it("does not add value in redisdb when count param is missing in qs", (done) => {
        chai.request(httpServer)
        .post('/track?cnuot=count')
        .end(() => {
            client.get("count", (err, reply) => {
                if (err) done(err);
                else {
                    reply.should.be.equal(rand + '')
                    done()
                }
            })
        })
    })

    //4
    it("does not add value if req method is different from POST - e.g. GET", (done) => {
        chai.request(httpServer)
        .get('/track?count=true&bark=haf')
        .end(() => {
            client.get("count", (err, reply) => {
                if (err) done(err);
                else {
                    reply.should.be.equal(rand + '')
                    done()
                }
            })
        })
    })

})
