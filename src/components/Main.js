require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');
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


// var ReactDemo = React.createClass({
//   render:function(){
//     return(
//       <div>
//         <section className="stage">
//           <section className="img-sec">
//             <nav className="controller-nav">
//               </nav>
//           </section>
//         </section>
//       </div>
//     )
//   }
// });


class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <section className="stage">
          <section className="img-sec">
            <nav className="controller-nav">
              </nav>
          </section>
        </section>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
