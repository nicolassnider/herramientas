import React from 'react';
import './palette-gradient.css';

const widget = (props) => {
  
  const progressBarStyle = {    
    visibility: 'hidden'
  };
  const progressStyle = {
    width: '0%'
  };

   
  if (props.hasProgressBar === 'true') {
    progressStyle.width = props.progressBarValue + '%';
    progressBarStyle.visibility = 'visible';
  } else {
    progressStyle.width = '0%';
    progressBarStyle.visibility = 'hidden';
  }
  return (
    <div className="card pull-up">
      <div className="card-content">
        <div className="card-body">
          <div className="media d-flex">
            <div className="media-body text-left">
              <h3 className={props.mainColorClass + " font-weight-500"}>{props.value}</h3>
              <h6>{props.description}</h6>
            </div>
            <div>
              <i className={props.iconClass + ' ' + props.mainColorClass + ' font-large-2 float-right'}></i>
            </div>
          </div>
          <div className="progress progress-sm mt-1 mb-0 box-shadow-2" style={progressBarStyle}>
            <div className={'progress-bar bg-gradient-x-' + props.mainColorClass} role="progressbar" style={progressStyle} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default widget;