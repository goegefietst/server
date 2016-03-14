(function() {
  'use strict';
  var superagent = require('superagent');
  var expect = require('expect.js');

  describe('express rest api server', function() {
    var id;

    it('posts an object', function(done) {
      superagent.post('http://localhost:3000/api/data')
        .send({
          'points': [{
            'accuracy': 6,
            'altitude': 127,
            'bearing': 0,
            'speed': 5.555,
            'time': 1457600719256,
            'latitude': 51.032792141270775,
            'longitude': 3.7704992294311523
          }]
        })
        .end(function(e, res) {
          // console.log(res.body)
          console.log(e);
          expect(e).to.eql(null);
          expect(res.body.points.length).to.eql(1);
          expect(res.body[0]._id.length).to.eql(24);
          id = res.body[0]._id;
          done();
        });
    });

    /*it('retrieves an object', function(done) {
      superagent.get('http://localhost:3000/collections/test/' + id)
        .end(function(e, res) {
          // console.log(res.body)
          expect(e).to.eql(null);
          expect(typeof res.body).to.eql('object');
          expect(res.body._id.length).to.eql(24);
          expect(res.body._id).to.eql(id);
          expect(res.body.name).to.eql('John');
          done();
        });
    });

    it('retrieves a collection', function(done) {
      superagent.get('http://localhost:3000/collections/test')
        .end(function(e, res) {
          // console.log(res.body)
          expect(e).to.eql(null);
          expect(res.body.length).to.be.above(0);
          expect(res.body.map(function(item) {
            return item._id;
          })).to.contain(id);
          done();
        });
    });

    it('updates an object', function(done) {
      superagent.put('http://localhost:3000/collections/test/' + id)
        .send({
          name: 'Peter',
          email: 'peter@yahoo.com'
        })
        .end(function(e, res) {
          // console.log(res.body)
          expect(e).to.eql(null);
          expect(typeof res.body).to.eql('object');
          expect(res.body.msg).to.eql('success');
          done();
        });
    });

    it('checks an updated object', function(done) {
      superagent.get('http://localhost:3000/collections/test/' + id)
        .end(function(e, res) {
          // console.log(res.body)
          expect(e).to.eql(null);
          expect(typeof res.body).to.eql('object');
          expect(res.body._id.length).to.eql(24);
          expect(res.body._id).to.eql(id);
          expect(res.body.name).to.eql('Peter');
          done();
        });
    });
    it('removes an object', function(done) {
      superagent.del('http://localhost:3000/collections/test/' + id)
        .end(function(e, res) {
          // console.log(res.body)
          expect(e).to.eql(null);
          expect(typeof res.body).to.eql('object');
          expect(res.body.msg).to.eql('success');
          done();
        });
    });
    it('checks an removed object', function(done) {
      superagent.get('http://localhost:3000/collections/test/')
        .end(function(e, res) {
          // console.log(res.body)
          expect(e).to.eql(null);
          expect(res.body.map(function(item) {
            return item._id;
          })).to.not.be(id);
          done();
        });
    });*/
  });
})();
