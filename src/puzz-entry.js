"use strict";
const crypto = require('crypto');
const assert = require('assert');
const _ = require('lodash');
const request = require('request');
/**
 * 获得签名字符串
 */
const getSign = (appid, appkey, timestamp, noncestr) => {
  // 1. 按键排序, 获得排序后的顺序, 拼接appkey
  const params = { appid, noncestr, timestamp };
  const keys = Object.keys(params);
  keys.sort();
  const string01 = keys.map(k => `${k}=${params[k]}`)
    .join('&')
    .concat(`&appkey=${appkey}`);
  // md5加密
  const md5 = crypto.createHash('md5');
  return md5.update(string01).digest('hex').toUpperCase();
};
/**
 * 生成验证用的随机字符串
 */
const getNonceStr = () => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
/**
 * 绘制图片背景 (由图片或纯色构成)
 * 优先级: img > color
 * @param {*} options 
 */
const drawBackground = function({ width, height, bgcolor, isZoom=false, imgurl }) {
  const root = {};
  if(imgurl && typeof imgurl === 'string') {
    // 拼接图片背景
    root.type = 'img';
    root.imgurl = imgurl;
    if(isZoom) {
      // 添加对于缩放的支持
      root.isZoom = isZoom;
      assert(_.isNumber(width) && width > 0 && width < 10000, '[Puzzles] drawBackground(): width invalid!');
      assert(_.isNumber(height) && height > 0 && height < 10000, '[Puzzles] drawBackground(): height invalid!');
      root.width = width;
      root.height = height;
    }
  }else if(bgcolor && typeof bgcolor === 'string'){
    root.type = 'purecolor';
    assert(_.isNumber(width) && width > 0 && width < 10000, '[Puzzles] drawBackground(): width invalid!');
    assert(_.isNumber(height) && height > 0 && height < 10000, '[Puzzles] drawBackground(): height invalid!');
    root.width = width;
    root.height = height;
    root.bgcolor = bgcolor;
  } else {
    throw new Error('[Puzzles] drawBackground(): imgurl or bgcolor is undefined.');
  }
  this.puzz.root = root;
  this.hasBackground = true;
};
/**
 * 绘制矩形
 * @param {*} options 
 */
const drawRectangle = function({width, height, x, y, widthCorner, heightCorner, fillColor, borderSize, borderColor}) {
  assert(_.isNumber(width) && width > 0 && width < 10000, '[Puzzles] drawRectangle(): width invalid!');
  assert(_.isNumber(height) && height > 0 && height < 10000, '[Puzzles] drawRectangle(): height invalid!');
  assert(_.isNumber(x) && x > -10000 && x < 20000, '[Puzzles] drawRectangle(): x invalid!');
  assert(_.isNumber(y) && y > -10000 && y < 20000, '[Puzzles] drawRectangle(): y invalid!');
  assert(fillColor || (borderSize && borderColor) ,'[Puzzles] drawRectangle(): fillColor or [borderSize, borderColor] at t least one exists!');
  const node = { type: 'shape', shape: 'rectangle', width, height, x, y };
  if(widthCorner && _.isNumber(widthCorner) && widthCorner > 0 && widthCorner < 10000) {
    node.widthCorner = widthCorner;
  }
  if(heightCorner && _.isNumber(heightCorner) && heightCorner > 0 && heightCorner < 10000) {
    node.heightCorner = heightCorner;
  }
  if(fillColor) node.fillColor = fillColor;
  if(borderSize) node.borderSize = borderSize;
  if(borderColor) node.borderColor = borderColor;
  this.puzz.nodes.push(node);
}
/**
 * 绘制圆形
 * @param {*} options 
 */
const drawCircle = function({x, y, r, fillColor, borderSize, borderColor}) {
  assert(_.isNumber(r) && r > 0 && r < 10000, '[Puzzles] drawCircle(): r invalid!');
  assert(_.isNumber(x) && x > -10000 && x < 20000, '[Puzzles] drawCircle(): x invalid!');
  assert(_.isNumber(y) && y > -10000 && y < 20000, '[Puzzles] drawCircle(): y invalid!');
  assert(fillColor || (borderSize && borderColor) ,'[Puzzles] drawCircle(): fillColor or [borderSize, borderColor] at t least one exists!');
  const node = { type: 'shape', shape: 'circle', x, y, r };
  if(fillColor) node.fillColor = fillColor;
  if(borderSize) node.borderSize = borderSize;
  if(borderColor) node.borderColor = borderColor;
  this.puzz.nodes.push(node);
}

/**
 * 绘制椭圆形
 * @param {*} options 
 */
const drawEllipse = function({x0, y0, rx, ry, a0, a1, fillColor, borderSize, borderColor}) {
  assert(_.isNumber(rx) && rx >= 0 && rx < 10000, '[Puzzles] drawEllipse(): rx invalid!');
  assert(_.isNumber(ry) && ry >= 0 && ry < 10000, '[Puzzles] drawEllipse(): ry invalid!');
  assert(_.isNumber(a0) && a0 >= 0 && a0 < 10000, '[Puzzles] drawEllipse(): a0 invalid!');
  assert(_.isNumber(a1) && a1 >= 0 && a1 < 10000, '[Puzzles] drawEllipse(): a1 invalid!');
  assert(_.isNumber(x0) && x0 > -10000 && x0 < 20000, '[Puzzles] drawEllipse(): x0 invalid!');
  assert(_.isNumber(y0) && y0 > -10000 && y0 < 20000, '[Puzzles] drawEllipse(): y0 invalid!');
  assert(fillColor || (borderSize && borderColor) ,'[Puzzles] drawEllipse(): fillColor or [borderSize, borderColor] at t least one exists!');
  const node = { type: 'shape', shape: 'ellipse', x0, y0, rx, ry, a0, a1 };
  if(fillColor) node.fillColor = fillColor;
  if(borderSize) node.borderSize = borderSize;
  if(borderColor) node.borderColor = borderColor;
  this.puzz.nodes.push(node);
}
/**
 * 绘制线条
 * @param {*} options 
 */
const drawLine = function({x0, y0, x1, y1, fillColor, borderSize, borderColor}) {
  assert(_.isNumber(x0) && x0 >= 0 && x0 < 10000, '[Puzzles] drawLine(): x0 invalid!');
  assert(_.isNumber(y0) && y0 >= 0 && y0 < 10000, '[Puzzles] drawLine(): y0 invalid!');
  assert(_.isNumber(x1) && x1 >= 0 && x1 < 10000, '[Puzzles] drawLine(): x1 invalid!');
  assert(_.isNumber(y1) && y1 >= 0 && y1 < 10000, '[Puzzles] drawLine(): y1 invalid!');
  assert(fillColor || (borderSize && borderColor) ,'[Puzzles] drawLine(): fillColor or [borderSize, borderColor] at t least one exists!');
  const node = { type: 'shape', shape: 'line', x0, y0, x1, y1 };
  if(fillColor) node.fillColor = fillColor;
  if(borderSize) node.borderSize = borderSize;
  if(borderColor) node.borderColor = borderColor;
  this.puzz.nodes.push(node);
}
/**
 * 绘制多边形
 * @param {*} options 
 */
const drawPolygon = function({points, fillColor, borderSize, borderColor}) {
  assert(_.isArrayLikeObject(points), '[Puzzles] drawPolygon(): points invalid!');
  for (const point of points) {
    const {x, y} = point;
    assert(_.isNumber(x) && x > -10000 && x < 20000, '[Puzzles] drawPolygon(): x invalid!');
    assert(_.isNumber(y) && y > -10000 && y < 20000, '[Puzzles] drawPolygon(): y invalid!');
  }
  assert(fillColor || (borderSize && borderColor) ,'[Puzzles] drawPolygon(): fillColor or [borderSize, borderColor] at t least one exists!');
  const node = { type: 'shape', shape: 'polygon', points };
  if(fillColor) node.fillColor = fillColor;
  if(borderSize) node.borderSize = borderSize;
  if(borderColor) node.borderColor = borderColor;
  this.puzz.nodes.push(node);
}
/**
 * 绘制图片
 * @param {*} options 
 */
const drawImage = function({width, height, left, top, imgurl}) {
  assert(_.isNumber(width) && width > 0 && width < 10000, '[Puzzles] drawImage(): width invalid!');
  assert(_.isNumber(height) && height > 0 && height < 10000, '[Puzzles] drawImage(): height invalid!');
  assert(_.isNumber(left) && left > -10000 && left < 20000, '[Puzzles] drawImage(): left invalid!');
  assert(_.isNumber(top) && top > -10000 && top < 20000, '[Puzzles] drawImage(): top invalid!');
  assert(_.isString(imgurl) && imgurl, '[Puzzles] drawImage(): imgurl invalid!');
  const node = { type: 'img', width, height, left, top, imgurl };
  this.puzz.nodes.push(node);
}

/**
 * 绘制文本
 * @param {*} options 
 */
const drawText = function({top, left, text, color, fontsize, family, gravity, borderColor, borderSize}) {
  assert(_.isNumber(top) && top > -10000 && top < 20000, '[Puzzles] drawText(): top invalid!');
  assert(_.isNumber(left) && left > -10000 && left < 20000, '[Puzzles] drawText(): left invalid!');
  assert(_.isString(text) && text, '[Puzzles] drawImage(): text invalid!');
  assert(_.isString(color) && color, '[Puzzles] drawImage(): color invalid!');
  assert(_.isNumber(fontsize) && fontsize > -10000 && fontsize < 20000, '[Puzzles] drawText(): fontsize invalid!');
  if (borderColor) {
    assert(_.isString(borderColor) && borderColor, '[Puzzles] drawImage(): borderColor invalid!');
  }
  if (borderSize) {
    assert(_.isNumber(borderSize) && borderSize > 0 && borderSize < 10000, '[Puzzles] drawImage(): borderColor invalid!');
  }
  const node = { type: 'text', top, left, text, color, fontsize, borderColor, borderSize };
  if(family) {
    assert(_.isString(family) && family, '[Puzzles] drawImage(): family invalid!');
    node.family = family;
  }
  if(gravity) {
    assert(_.isString(gravity) && gravity, '[Puzzles] drawImage(): gravity invalid!');
    node.gravity = gravity;
  }
  this.puzz.nodes.push(node);
}

const PUZZLES_SERVER = 'http://puzzles.net.cn:50036/puzzles';

const defaultInitOption = { 
  appid: 'dedfc26626fd11eab04700163e00b07d', 
  secret: 'dedfc27226fd11eab04700163e00b07ddedfc27526fd11eab04700163e00b07d', 
  dataType:'buffer'
};
/**
 * Puzz对象
 */
class Puzz{
  constructor(options){
    const {appid, secret, dataType} = {...defaultInitOption, ...options};
    // console.log('options: ', options);

    assert(appid && typeof appid === 'string', '[Puzzles] appid invalid!');
    assert(secret && typeof secret === 'string', '[Puzzles] secret invalid!');
    assert(dataType && typeof dataType === 'string', '[Puzzles] dataType invalid!');

    this.drawBackground = drawBackground.bind(this);  // 绘制背景
    this.drawRectangle = drawRectangle.bind(this);  // 绘制一个矩形 (可设置圆角)
    this.drawCircle = drawCircle.bind(this);  // 绘制一个圆形
    this.drawEllipse = drawEllipse.bind(this);  // 绘制一个椭圆
    this.drawLine = drawLine.bind(this);  // 绘制一个线条
    this.drawPolygon = drawPolygon.bind(this);  // 绘制一个多边形
    // 生成6位随机验证码
    // this.drawSecurityCode = drawSecurityCode.bind(this);
    // 绘制图片
    this.drawImage = drawImage.bind(this);
    // 绘制文字
    this.drawText = drawText.bind(this);

    // 生成签名
    const timestamp = Number(`${(new Date()).getTime()}`.substring(0, 10));
    const noncestr = getNonceStr();
    const sign = getSign(appid, secret, timestamp, noncestr);
    this.option = {appid, timestamp, noncestr, sign, dataType};
    this.puzz = {
      nodes: []
    };
  }

  render(){
    assert(this.hasBackground, '[Puzzles] The background is not drawn!');
    assert(this.puzz.root, '[Puzzles] The background is not drawn!');
    assert(this.puzz.nodes && this.puzz.nodes.length > 0, '[Puzzles] The nodes coverage length is 0!');
    this.option.puzz = this.puzz;
    // const util = require('util');
    // console.log('发送参数: ', util.inspect(this.option, true, 5));

    return new Promise((resolve, reject) => {
      request({ 
        url: PUZZLES_SERVER,
        method: 'POST',
        json: true,
        body: this.option,
      }, function(err, response, data) {
        if(err) {
          console.error(err);
          return reject(err);
        }
        console.log('拼接结果: ', data);
        resolve(data);
      });
    });
  }
}
module.exports  = Puzz;