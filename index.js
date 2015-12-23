"use strict";

var stream = require('stream');
var util = require('util');

var streamEnc = 'utf8';

function SitemapStream () {
  stream.Transform.call(this, {
    objectMode: true,
    encoding: streamEnc
  });
  this._headOutputted = false;
}

util.inherits(SitemapStream, stream.Transform);

function encodeHTML (str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

SitemapStream.prototype._transform = function (chunk, encoding, callback) {
  if (!this._headOutputted) {
    this.push('<?xml version="1.0" encoding="UTF-8"?>\r\n', streamEnc);
    this.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', streamEnc);
    this._headOutputted = true;
  }

  if (typeof(chunk) === 'string') {
    chunk = {
      loc: chunk
    };
  }

  this.push('<url>', streamEnc);
  this.push('<loc>', streamEnc);
  this.push(encodeHTML(chunk.loc), streamEnc);
  this.push('</loc>', streamEnc);

  if (chunk.lastmod) {
    this.push('<lastmod>', streamEnc);
    this.push(encodeHTML(chunk.lastmod), streamEnc);
    this.push('</lastmod>', streamEnc);
  }

  if (chunk.changefreq) {
    this.push('<changefreq>', streamEnc);
    this.push(encodeHTML(chunk.changefreq), streamEnc);
    this.push('</changefreq>', streamEnc);
  }

  if (chunk.priority) {
    this.push('<priority>', streamEnc);
    this.push(encodeHTML(chunk.priority), streamEnc);
    this.push('</priority>', streamEnc);
  }

  this.push('</url>', streamEnc);
  callback();
};

SitemapStream.prototype._flush = function (callback) {
  this.push('</urlset>', streamEnc);
  callback();
};

module.exports = function () {
  return new SitemapStream();
};
