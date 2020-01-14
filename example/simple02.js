/**
 * 该示例的操作有: 
 * 绘制一个图片背景
 * 添加一张图片
 * 添加一段文本
 */
"use strict";
const Puzz = require('../src/puzz-entry');

(async function(){
  const puzz = new Puzz({dataType: 'buffer'});
  // 为拼图添加一个纯色或图片背景(此处为纯色背景)
  puzz.drawBackground({
    imgurl: 'https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/cardbg.png'
  });
  // 添加绘制一段文字
  puzz.drawText({top: 70, left: 0, text: 'Welcome To', color: '#823030', fontsize: 28, family: 'pumplain', gravity: 'North'});
  puzz.drawText({top: 100, left: 0, text: 'Puzzles', color: '#823030', fontsize: 28, family: 'pumplain', gravity: 'North'});
  // 添加绘制一个二维码图片
  puzz.drawImage({
      width: 100, height: 100, left: 145, top: 430, 
      imgurl: 'https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/qrcode_for_gh_5f7e3a06337d_430.jpg',
  });
  // 添加绘制一段文字
  puzz.drawText({top: 430, left: 26, text: '阿拉拉布', color: '#0a293b', fontsize: 22, family: 'msyhbd'});
  puzz.drawText({top: 470, left: 26, text: '邀请你来一起', color: '#0a293b', fontsize: 14});
  puzz.drawText({top: 490, left: 26, text: '拼图鸭~', color: '#0a293b', fontsize: 14});
  
  const res = await puzz.render();
  if(!res.err){
    const fs = require('fs');
    const wres = await fs.writeFileSync('./simple02.png', new Buffer(res.data.data));
    console.log('写入文件:', wres);
  }else{
    console.error('Error:', res);
  }
})();