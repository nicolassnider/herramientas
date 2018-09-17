import React from 'react';
import {RadialBarChart, RadialBar, Legend} from 'recharts';
//import {RadialBarChart, RadialBar, Tooltip, Legend, Label, LabelFormatter} from 'recharts';

const radial = (props) => {

  const data = [
    {name: '18-24', uv: 31.47, pv: 2400, fill: '#8884d8'},
    {name: '25-29', uv: 26.69, pv: 4567, fill: '#83a6ed'},
    {name: '30-34', uv: 15.69, pv: 1398, fill: '#8dd1e1'}
  ];

  const style = {
    top: 0,
    left: 200,
    lineHeight: '24px'
  };

  return (
    <div className="card pull-up">
      <div className="card-content">
        <div className="card-body">

 	        <RadialBarChart width={500} height={300} cx={150} cy={150} innerRadius={90} outerRadius={140} barSize={20} data={data} startAngle={90} endAngle={315}>
            <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise={true} dataKey='uv'/>
            <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' wrapperStyle={style}/>
          </RadialBarChart>          
        </div>
      </div>
    </div>
  );
  
}

/*<RadialBarChart width={props.width} height={props.height} cx={props.cx} cy={props.cy} innerRadius={props.innerRadius} outerRadius={props.outerRadius} barSize={props.barSize} data={data} startAngle={props.startAngle} endAngle={props.endAngle}>
            <RadialBar minAngle={0} label={{ position: 'insideEnd', fill: '#fff' }} background clockWise={true} dataKey='uv'/>
            <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' wrapperStyle={style}/>
          </RadialBarChart>*/

export default radial;
