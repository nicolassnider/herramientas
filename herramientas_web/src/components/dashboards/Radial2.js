import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';  // or var ReactEcharts = require('echarts-for-react');

export default class Radial2 extends PureComponent {   
  getOption = () => {
    return this.props.conf;    
  };
  render() {    
    return (
      <div className="card pull-up">
        <div className="card-content">
          <div className="card-header">
            <h4 className="card-title">{this.props.cardTitle}</h4>          
          </div>
          <div className="card-body">          
          <ReactEcharts option={this.getOption()} style={{height: '250px', width: '100%'}} className='react_for_echarts' />             
        </div>
      </div>
      </div>      
    );
  }
}


