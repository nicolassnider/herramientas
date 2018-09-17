import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import Security from '../../commons/security/Security.js'
import Widget from './Widget.js';
import Multiple from './Multiple.js';
//import Radial from './Radial.js';
import Radial2 from './Radial2.js';
import Accordion from './Accordion.js';
import NightingaleRoseLabels from './NightingaleRoseLabels.js';
import GastoPorBase from './NightingaleRoseLabels.js';
import Gauge from './Gauge.js';
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'


class DashboardOperativo extends Component {

  constructor(props) {
    super(props);
    this.ajaxHandler = new AjaxHandler();

    this.state = {
      widgets: [],
      radials: [],
      accordions: [],
      ngls: [],
      gastoModelo: [],
      gauges: []
    };
  }

  componentWillUnmount() {
		this.ajaxHandler.unsubscribe();
  }
  
  componentDidMount(nextProps, nextState) {
    if(Security.hasPermission('DASHBOARD_OPERATIVO_VISUALIZAR')) {
      this.ajaxHandler.subscribe(this);
      this.initData();
      //this.initForm();
      
    } else {
        this.setState({
          redirectTo: '/error'
        });
    }
  }

  initData() {
    // this.getData('widgets', './json/widgets.json');
    let component = this;
    // this.getData('radials', './json/radials.json');
    this.getData('accordions', './json/accordions.json');
    //this.getData('ngls', './json/ngls_teco.json');
    //this.getData('ngls', './json/ngls_dtv.json');
    this.getData('gauges', './json/gauges.json');
    
    Promise.all([
      this.ajaxHandler.getJson('/widgets', null),
      this.ajaxHandler.getJson('/radials', null),
      this.ajaxHandler.getJson('/ngls', null),
      this.ajaxHandler.getJson('/gasto-modelo', null)
    ]).then((data) => {
      let widgets = data[0];
      let radials= data[1];
      let ngls = data[2];
      let gastoModelo = data[3];
      component.setState({
        widgets: widgets,
        radials: radials,
        ngls: ngls,
        gastoModelo: gastoModelo,
        
      });
    }).catch(function(error) {
			console.log(error);
			component.exit();
		}).finally(() => {
			this.setState({ loading: false });
    });
  }

  getData = (stateKey, jsonFile) => {
    fetch(jsonFile, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.json())
		.then(data => {
			this.setState({[stateKey]: data});
		})
		.catch(function(error) {
			// TODO: Manejo de errores
			console.log(error);
		});
  }

  render(){
    return (
      <React.Fragment>
        {this.state.redirectTo && <Redirect push to={this.state.redirectTo} />}
        <div className="content-wrapper">
          <div className="content-body">
            <div className="row">
              {this.state.widgets.map((widget, index)=>{
                return(
                  <div key={index} className="col-xl-3 col-lg-6 col-12">
                    <Widget value={widget.value} description={widget.description} iconClass={widget.iconClass} mainColorClass={widget.mainColorClass} hasProgressBar={widget.hasProgressBar} progressBarValue={widget.progressBarValue} />
                  </div>
                );
              })}
            </div>
            
            
            <div className="row">
              {this.state.radials.map((radial, index)=>{
                return(
                  <div key={index} className="col-xl-6 col-lg-6 col-12">
                    <Radial2 cardTitle={radial.cardTitle} conf={radial.conf}></Radial2>
                  </div>
                );
              })}
            </div>
            <div className="row">
              {/*
              {this.state.accordions.map((accordion, index)=>{
                return(
                  <div key={index} className="col-xl-3 col-lg-3 col-12">
                    <Accordion conf={accordion} ></Accordion>
                  </div>
                );
              })}
            */}
              
              {this.state.ngls.map((ngl, index)=>{
                return(
                  <div key={index} className="col-xl-12 col-lg-3 col-12">
                    {Security.renderIfHasAnyPermission('BASES_CREAR', (
                      <NightingaleRoseLabels cardTitle={ngl.cardTitle} conf={ngl.conf}></NightingaleRoseLabels>
                    ))}  
                    </div>
                );
              })}
              
              </div>
              <div className="row">
              {this.state.gastoModelo.map((ngl, index)=>{
                return(
                  <div key={index} className="col-xl-12 col-lg-3 col-12">
                    {Security.renderIfHasAnyPermission('BASES_CREAR', (
                      <GastoPorBase cardTitle={ngl.cardTitle} conf={ngl.conf}></GastoPorBase>
                    ))}
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DashboardOperativo;

/*<div className="row">
<div className="col-xl-3 col-lg-6 col-12">
  <Radial width="500" height="300"  cx="150" cy="150" innerRadius="90" outerRadius="140" barSize="10"></Radial>
</div>
</div>*/