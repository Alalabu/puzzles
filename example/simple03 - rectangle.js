/**
 * 该示例的操作有: 
 * 绘制一个纯色背景
 * 添加一个矩形
 */
"use strict";
const Puzz = require('../src/puzz-entry');

(async function(){
  const puzz = new Puzz({dataType: 'buffer'});
  // 为拼图添加一个纯色或图片背景(此处为纯色背景)
  puzz.drawBackground({width: 200, height: 300, bgcolor: '#ECE012'});
  // 添加绘制一个形状
  puzz.drawRectangle({
    width: 100, height: 50, 
    x: 10, y: 15, 
    widthCorner: 5, heightCorner: 5, 
    fillColor: '#1F1E1A'
  });
  // 添加绘制一段文字
  puzz.drawText({top: 80, left: 0, text: '矩形', color: '#1F1E1A', fontsize: 22, family: 'msyhbd', gravity: 'North'});
  puzz.drawText({top: 110, left: 0, text: 'Rectangle', color: '#1F1E1A', fontsize: 22, family: 'segoeprb', gravity: 'North'});
  
  const res = await puzz.render();
  if(!res.err){
    const fs = require('fs');
    const wres = await fs.writeFileSync('./simple03.png', new Buffer(res.data.data));
    console.log('写入文件:', wres);
  }else{
    console.error('Error:', res);
  }
})();