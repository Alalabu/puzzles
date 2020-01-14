## Puzzles

![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/logo-write.jpg)

puzzles 是一个用于 **动态** 将多个图片、文本或形状，合并成一个图片的工具。在使用 puzzles 的过程中，**你不需要安装任何第三方工具**便可以直接使用，只要调用相应的函数，便可以将你所需要的操作发送至专门用于拼接图片的云端服务器。在拼接完成后，会将合并好的图片以 `Buffer` 或 `base64` 的数据方式返回给你。

## 一个简单的Demo
> 以下demo尝试将一个图片和文字合并入一个纯色背景中，生成新的图片。
> 项目中 `example` 目录下提供了更多示例。

#### 1. 前端页面中的使用：
``` html
<img id='example' />

<script src="./puzzles.js" />
<script>
	var puzz = new Puzz();
	// 为拼图添加一个纯色或图片背景(此处为纯色背景)
	puzz.drawBackground({width: 200, height: 300, bgcolor: '#DD5145'});
	// 添加绘制一个图片
	puzz.drawImage({
		width: 100, height: 100, x: 50, y: 50, 
		imgurl: 'https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/js-logo.jpg',
	});
	// 添加绘制一段文字
	puzz.drawText({top: 170, left: 30, text: 'I love code!', color: '#FFF', fontsize: 25, family: 'msyh'});
	// 获取渲染结果
	puzz.render((res) => {
		const imgData = res.data;
		// 页面调用过程中返回数据为base64数据格式,可直接赋值于 img 标签的 src 属性
		document.getElementById('example').src = imgData;
	});
</script>
```
##### 页面显示结果：
![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/puzz-01.png)

#### 2. node.js服务器端中的使用：
```javascript
"use strict";
const Puzz = require('puzzles');

// 某一个用于生成图片的函数
const someFunc = async function(){
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
  // 获取渲染结果
  const res = await puzz.render();
  if(!res.err){
    const fs = require('fs');
    const wres = await fs.writeFileSync('./demo01-first.png', new Buffer(res.data.data));
    console.log('写入文件结果:', wres);
  }
};
```
##### 本地文件输出结果:
![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/puzz-02.png)

## 应用场景
> 如果你只需要生成一张图片(不需要自动填充变量)，建议使用美图秀秀、PS、AI之类的做图软件；

- 批量自动化的名片、海报生成；
- 背景相似，局部不同的图片生成，如：每个用户的标签拥有不同的二维码；
- 无需服务器端支持的纯前端图文生成;
- node.js服务器端自动化图文拼接；
- ...

## 场景例举
> 我们需要根据用户来生成可以裂变新用户的分享图，其中背景是设计好的模板，而一些其他数据需要实时动态获取，例如用户信息、分享码或者二维码、商品图片等

![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/Building.jpg)

## 可拼接内容
- 将多图片进行拼接;
- 选择不同的字体，生成拼接文字;
- 生成可拼接的形状，包含矩形、圆形、椭圆形、多边形或线条；

## 拼接步骤
- 1.实例化 `Puzz` 对象;
- 2.通过 `drawBackground()` 绘制背景;
- 3.通过其他的 `draw...()` 函数绘制其他图层;
- 4.渲染并得到返回结果。

## Install
> npm install puzzles --save

## API
### constructor({dataType})
> 构造函数<br />
> dataType [string] 描述响应时接收的数据类型，可选值为：base64、buffer。

### render()
> 渲染函数(仅服务器端)<br />
> 对拼接过程进行组合并进行渲染，返回值是一个 `Promise`。<br />
> 返回的 `res` 对象的数据结构为: `{err, msg, data}`

### render([callback])
> 渲染函数(仅前端)<br />
> 对拼接过程进行组合并进行渲染，返回数据将传递给回调函数 `callback`。<br />
> 返回的 `res` 对象的数据结构为: `{err, msg, data}`

### drawBackground({ width, height, bgcolor, isZoom=false, imgurl })
> 绘制背景(纯色背景或图片背景，二选一)<br />
> 若 `imgurl` 有值，则为图片背景；<br />
> 上述条件满足时，若 `isZoom=true` 则会根据 `width` 和 `height`的值对图片进行宽高缩放。<br />
> 若 `imgurl` 为空，且 `bgcolor` 有值，则会根据 `width` 和 `height`的值生成纯色背景。<br />
> 若 `imgurl` 与 `imgurl` 都为空，则抛出异常。<br />
> <font color=red>注意：当前版本中所有的图片都必须是 weburl 地址，不支持本地图片直接上传拼接。</font><br />
> **width** [number] 整体背景(画布)的宽度，单位 px<br />
> **height** [number] 整体背景(画布)的高度，单位 px<br />
> **bgcolor** [string] 背景颜色，仅支持16进制的RGB色值，如 `#000000` 代表黑色；`transparent`表示透明色。<br />
> **isZoom** [boolean] 是否缩放背景图, 仅当背景是图片时有效<br />
> **imgurl** [string] 图片的 url 地址,与 `bgcolor` 属性至少二选一

### drawImage({width, height, left, top, imgurl})
> 绘制一张图片<br />
> **width** [number] 图片的宽度，单位 px<br />
> **height** [number] 图片的高度，单位 px<br />
> **left** [number] 图片的 x 轴坐标，单位 px<br />
> **top** [number] 图片的 y 轴坐标，单位 px<br />
> **imgurl** [string] 图片的 url 地址

### drawText({top, left, text, color, fontsize, family, borderColor, borderSize, gravity})
> 绘制一段文本<br />
> **left** [number] 文本的 x 轴坐标，单位 px<br />
> **top** [number] 文本的 y 轴坐标，单位 px<br />
> **text** [string] 文本内容<br />
> **color** [string] 文本颜色，仅支持16进制的RGB色值，如 `#000000` 代表黑色<br />
> **fontsize** [number] 文本字体大小，单位 px<br />
> **family** [string] (可选) 文本字体，默认 **"msyh"** (微软雅黑)。变更其他字体请阅读后面的 **Fonts** 部分内容。<br />
> **borderColor** [string] 文本边框颜色，仅支持16进制的RGB色值<br />
> **borderSize** [number] 文本边框宽度，单位 px<br />
> **gravity** [string] (可选) 文本位置重心，可选值有：`NorthWest`、`North`、`NorthEast`、`West`、`Center`、`East`、`SouthWest`、`South`、`SouthEast`

### drawRectangle({width, height, x, y, widthCorner, heightCorner, fillColor, borderSize, borderColor})
> 绘制一个矩形<br />
> **width** [number] 矩形的宽度，单位 px<br />
> **height** [number] 矩形的高度，单位 px<br />
> **x** [number] 矩形位置的 x 轴坐标，单位 px<br />
> **y** [number] 矩形位置的 y 轴坐标，单位 px<br />
> **widthCorner** [number] 矩形的圆角，单位 px<br />
> **heightCorner** [number] 矩形的圆角，单位 px<br />
> **fillColor** [string] 形状填充颜色，仅支持16进制的RGB色值；`transparent`表示透明色。<br />
> **borderSize** [number] 边框宽度，单位 px<br />
> **borderColor** [string] 形状边框颜色，仅支持16进制的RGB色值

### drawCircle({x, y, r, fillColor, borderSize, borderColor})
> 绘制一个圆形<br />
> <font color=red>注意：圆形的 x 和 y 表示中心点坐标, 而非左上角坐标。</font><br />
> **x** [number] 圆形中心位置的 x 轴坐标，单位 px<br />
> **y** [number] 圆形中心位置的 y 轴坐标，单位 px<br />
> **r** [number] 圆形的半径，单位 px<br />
> **fillColor** [string] 形状填充颜色，仅支持16进制的RGB色值；`transparent`表示透明色。<br />
> **borderSize** [number] 边框宽度，单位 px<br />
> **borderColor** [string] 形状边框颜色，仅支持16进制的RGB色值

### drawEllipse({x0, y0, rx, ry, a0, a1, fillColor, borderSize, borderColor})
> 绘制一个椭圆<br />
> <font color=red>注意：圆形的 x 和 y 表示中心点坐标, 而非左上角坐标。</font><br />
> **x0** [number] 圆形中心位置的 x0 轴坐标，单位 px<br />
> **y0** [number] 圆形中心位置的 y0 轴坐标，单位 px<br />
> **rx** [number] x 轴的半径，单位 px<br />
> **ry** [number] y 轴的半径，单位 px<br />
> **a0** [number] 绘制的开始角度，单位 px<br />
> **a1** [number] 绘制的结束角度，单位 px<br />
> **fillColor** [string] 形状填充颜色，仅支持16进制的RGB色值；`transparent`表示透明色。<br />
> **borderSize** [number] 边框宽度，单位 px<br />
> **borderColor** [string] 形状边框颜色，仅支持16进制的RGB色值

### drawPolygon({points, fillColor, borderSize, borderColor})
> 绘制一个多边形<br />
> **points** [Array<{x,y}>] points是一个坐标点的集合，集合中每一个对象都由 `x` 和 `y` 属性来描述点坐标。集合中，末尾的坐标会与数组首位的坐标自动闭合。<br />
> **fillColor** [string] 形状填充颜色，仅支持16进制的RGB色值；`transparent`表示透明色。<br />
> **borderSize** [number] 边框宽度，单位 px<br />
> **borderColor** [string] 形状边框颜色，仅支持16进制的RGB色值


### drawLine({x0, y0, x1, y1, fillColor, borderSize, borderColor})
> 绘制一个线条<br />
> **x0** [number] 线条开始位置的 x 轴坐标，单位 px<br />
> **y0** [number] 线条开始位置的 y 轴坐标，单位 px<br />
> **x1** [number] 线条结束位置的 x 轴坐标，单位 px<br />
> **y1** [number] 线条结束位置的 y 轴坐标，单位 px<br />
> **fillColor** [string] 形状填充颜色，仅支持16进制的RGB色值；`transparent`表示透明色。<br />
> **borderSize** [number] 边框宽度，单位 px<br />
> **borderColor** [string] 形状边框颜色，仅支持16进制的RGB色值

## Fonts
文本内容中当前可选的字体有:
- 英文字体<br />
-- **pumplain**<br />
![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/en/pumplain.png)<br />
-- **sanss**<br />
![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/en/sanss.png)<br />
-- **sanssb**<br />
![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/en/sanssb.png)<br />
-- **sansso**<br />
![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/en/sansso.png)<br />
-- **segoepr**<br />
![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/en/segoepr.png)<br />
-- **segoeprb**<br />
![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/en/segoeprb.png)<br />
-- **showg**<br />
![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/en/showg.png)<br />

- 中文字体<br />
-- **msyh**  (微软雅黑标准)<br />
![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/zh/msyh.png)<br />
-- **msyhbd**  (微软雅黑粗体)<br />
![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/zh/msyhbd.png)<br />
-- **msyhl**  (微软雅黑细体)<br />
![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/zh/msyhl.png)<br />
-- **simhei**  (黑体)<br />
![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/zh/simhei.png)<br />
-- **simkai**  (楷体)<br />
![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/zh/simkai.png)<br />
-- **simli**  (隶书)<br />
![](https://sheu-huabei2.oss-cn-beijing.aliyuncs.com/puzzles_demo/zh/simli.png)<br />


## Future
> 未来预计添加的升级内容

- 自定义字体上传及应用
- 文本自动换行
- 更多的形状支持
- 本地图片拼接
