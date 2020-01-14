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
  puzz.drawPolygon({
    points: [{ x: 65.4505, y: 38.774 },
      { x: 59.548, y: 20.6105 },
      { x: 74.9995, y: 31.836 },
      { x: 90.45, y: 20.6105 },
      { x: 84.5485, y: 38.774 },
      { x: 100, y: 50 },
      { x: 80.901, y: 50 },
      { x: 75, y: 68.163 },
      { x: 69.098, y: 50 },
      { x: 50, y: 50 }],
    fillColor: '#1F1E1A'
  });
  // 添加绘制一段文字
  puzz.drawText({top: 80, left: 0, text: '多边形', color: '#1F1E1A', fontsize: 22, family: 'msyhbd', gravity: 'North'});
  puzz.drawText({top: 110, left: 0, text: 'Polygon', color: '#1F1E1A', fontsize: 22, family: 'segoeprb', gravity: 'North'});
  
  const res = await puzz.render();
  if(!res.err){
    const fs = require('fs');
    const wres = await fs.writeFileSync('./simple06.png', new Buffer(res.data.data));
    console.log('写入文件:', wres);
  }else{
    console.error('Error:', res);
  }
})();