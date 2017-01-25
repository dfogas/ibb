const mocha = require('mocha')
const chai = require('chai'), should = chai.should()
const chaiHttp = require('chai-http')
const httpServer = require('../index.js')

chai.use(chaiHttp)

describe('count route', () => {
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
    it('returns 0 for non-existing db key', (done) => {
        client.del("count", (err) => {
            chai.request(httpServer)
            .get('/count')
            .end((err, res) => {
                if (err) {
                    done(err)
                }
                res.res.text.should.be.equal('0')
                done()
            })
        })
    })

    //2
    it('returns value stored in redis db', (done) => {
        chai.request(httpServer)
        .get('/count')
        .end((err, res) => {
            if (err) {
                done(err)
            }
            res.res.text.should.be.equal(rand + '')
        done()
        })
    })

})
