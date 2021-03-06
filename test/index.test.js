'use strict';
const fs = require('fs');
const path = require('path');
const post = require('../');
const gulp = require('gulp');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;
const before = require('mocha').before;
const after = require('mocha').after;
describe('gulp-http-post', () => {
    const filePath = path.join('temp', 'file.tmp');
    before(done=> {
        fs.mkdir('temp', ()=> {
            fs.writeFile(filePath, 'gulp', done);
        });
    });
    after(done=> {
        fs.unlink(filePath, ()=> {
            fs.rmdir('temp', done);
        });
    });
    it('should throw, when url is undefined.', ()=> {
        expect(post).to.throw(Error);
    });
    it('should throw, when file is missing.', ()=> {
        gulp.src('undefined.file')
            .pipe(post('https://npmjs.com', undefined))
            .on('error', err=> {
                expect(err).to.be.an('error');
            });
    });
    it('should throw, when domain unreachable.', done=> {
        gulp.src(filePath)
            .pipe(post('http://undefineddomain.com', {
                callback: err=> {
                    if (err) {
                        expect(err).to.be.an('error');
                        done();
                    }
                }
            }));
    });
    it('should response sth.', done=> {
        gulp.src(filePath)
            .pipe(post('https://npmjs.com', {
                callback: (err, data, response)=> {
                    expect(data).to.be.an('string');
                    expect(response).to.be.an('object');
                    done();
                }
            }));
    });
});