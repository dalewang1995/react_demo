require('normalize.css/normalize.css');
require('styles/App2.css');

import React from 'react';
import ReactDOM from 'react-dom';


var imageDatas = require('../data/imageData.json');
// 获取图片地址， 名称转换为地址
function getImageUrl (imageDatasArr){
  for(var i = 0, j=imageDatasArr.length; i<j;i++){
    var singleImageData = imageDatasArr[i];
    singleImageData.imageUrl = require('../images/'+singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
}
imageDatas = getImageUrl(imageDatas);

//获取区间内的一个随机值

var getRangeRandom = (low, high) => Math.ceil(Math.random() * (high - low) + low);

// 随机角度生成 获取0~30之间的一个任意正负值

var get30DegRandom = () => {
  let deg = '';
  deg = (Math.random() > 0.5) ? '+' : '-';
  return deg + Math.ceil(Math.random() * 30);
}

class ImageFigureCommponent extends React.Component{
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  /*
   *  imgFigure 的点击处理函数
   */

  handleClick(e) {
    //居中 进行翻转操作
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  }


  render() {

    var styleObj = {};
    //如果 props 指定了这张图片的位置  则使用

    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
  
    // 如果旋转角度有值 并且不为 0， 添加旋转角度

    if(this.props.arrange.rotate) {
      (['moz', 'ms', 'webkit', '']).forEach((value) =>{
      styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      
      });
    }
    // 如果是中间位置 zIndex 设置

    if(this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }
    // 存取类名
    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse ' : '';

    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageUrl}
            alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}
// 控制组件
class ControllerUnit extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    // 如果点击的正是当前选中的图片，则翻转图片，否者把该图片设置为居中
      if(this.props.arrange.isCenter) {
        this.props.inverse();
      } else {
        this.props.center();
      }

    e.stopPropagation();
    e.preventDefault();
  }


  render() {

    let controllerUnitsClassName = "controller-unit";
    // 如果对应的是居中态，显示按钮的居中态
    if(this.props.arrange.isCenter) {
      controllerUnitsClassName += " is-center";
      // 如果同时对应的是显示按钮 ， 显示按钮的翻转态
      if(this.props.arrange.isInverse) {
        controllerUnitsClassName += " is-inverse"
      }
    } 
    return (
      <span className={controllerUnitsClassName} onClick={this.handleClick}></span>
    )
  }
}


class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.Constant={
      centerPos:{
        left: 0,
        right: 0
      },
      hPosRange:{ //水平方向的取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: { //垂直方向取值范围
        x: [0, 0],
        topY:[0, 0]
      }
    };

    this.state = {
      imgsArrangeArr:[
        //{
        //  pos:{
        //    left:'0',
        //    top:'0'
        //  },
        //    rotate:0, //旋转角度
        //isInverse:false //正反面
        //isCenter:false 图片是否居中
        //}
      ]
    };
  }
/*
 *   反转图片 @param index 输入当前被执行inverse操作的数组的index值
 *   @return {Function}  这是一个闭包函数，其内return 一个真正待被执行的函数
 */

  //翻转图片的函数
  inverse(index) {
    return () => {
      let imgsArrangArr = this.state.imgsArrangeArr;
      imgsArrangArr[index].isInverse = !imgsArrangArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangArr
      })
    }
  }

  /*
   * 当非居中的图片被点击时，利用rearrange函数，居中对应index的图片
   * @param index，需要被居中的图片信息数组中的index值
   * @return {function} (return一个闭包函数)
   */
  center (index) {
    return function () {
      this.rearrange(index)
    }
  }

/*
 *   重新布局所有图片   @param centerIndex 指定哪个图片居中
 *
 */

  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
    Constant = this.Constant,
    centerPos = Constant.centerPos,
    hPosRange = Constant.hPosRange,
    vPosRange = Constant.vPosRange,
    hPosRangeLeftSecX = hPosRange.leftSecX,
    hPosRangeRightSecX = hPosRange.rightSecX,
    hPosRangeY = hPosRange.y,
    vPosRangeTopY = vPosRange.topY,
    vPosRangeX = vPosRange.x,
    imgsArrangTopArr = [],
    topImgNum = Math.floor(Math.random() * 2), //取一个或者不取 floor 向下取整 ceil 上取整
    topImgSpliceIndex = 0,
    imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    // 首先居中 centerIndex 图片
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      roate: 0,
      isCenter: true
    }

    // 取出要布局上侧的图片  状态信息

    topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));

    imgsArrangTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局位于上侧的图片
    imgsArrangTopArr.forEach((value, index) => {
      imgsArrangTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    });
  

    //布局左两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局左边,右边部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX
      }
      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    }

    // debugger;

    if (imgsArrangTopArr && imgsArrangTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }

  render() {

    let controllerUnits = [];
    let  imgFigures = [];

    imageDatas.forEach((value, index) =>{
            if(!this.state.imgsArrangeArr[index]) {
              this.state.imgsArrangeArr[index] = {
                pos: {
                  left: 0,
                  top: 0
                },
                roate: 0,
                isInverse: false,
                isCenter: false
              }
            }
            imgFigures.push(
                <ImageFigureCommponent 
                  data = {value} 
                  ref={'imgFigure'+ index} 
                  key={index} 
                  arrange={this.state.imgsArrangeArr[index]} 
                  inverse={this.inverse(index)} 
                  center={this.center(index).bind(this)}
                />
            );

            controllerUnits.push(
              <ControllerUnit

                arrange={this.state.imgsArrangeArr[index]} 
                inverse={this.inverse(index)} 
                center={this.center(index).bind(this)}
              />
            );


      
          });

    return (
      <div>
        <section className="stage" ref="stage">
          <section className="img-sec">
            {imgFigures}
            <nav className="controller-nav">
              {controllerUnits}
              </nav>
          </section>
        </section>
      </div>
    );
  }
  //组件加载以后  为每张图片计算位置
  componentDidMount() {
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      // ceil 整数处理
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    //拿到一个imgFigure的大小

    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置点
    this.Constant.centerPos = {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
      }
    //计算左侧,右侧区域图片排布的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    // 属性的上下线
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    //计算上测区域图片排布的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    let num = Math.ceil(Math.random() * 10);
    this.rearrange(num);
  }

}

AppComponent.defaultProps = {
};

export default AppComponent;
