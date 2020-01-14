/**
 * 该示例的操作有: 
 * 绘制一个纯色背景
 * 添加一张图片
 * 添加一段文本
 */
"use strict";
const Puzz = require('../src/puzz-entry');

(async function(){
  const puzz = new Puzz({dataType: 'buffer'});
  // 为拼图添加一个纯色或图片背景(此处为纯色背景)
  puzz.drawBackground({width: 200, height: 300, bgcolor: '#DD5145'});
  // 添加绘制一个图片
  puzz.drawImage({
      width: 100, height: 100, left: 50, top: 50, 
      imgurl: 'https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/js-logo.jpg',
  });
  // 添加绘制一段文字
  puzz.drawText({top: 170, left: 30, text: 'I love code!', color: '#FFF', fontsize: 25, family: 'msyh'});
  const res = await puzz.render();
  if(!res.err){
    const fs = require('fs');
    const wres = await fs.writeFileSync('./simple01.png', new Buffer(res.data.data));
    console.log('写入文件:', wres);
  }else{
    console.error('Error:', res);
  }
})();