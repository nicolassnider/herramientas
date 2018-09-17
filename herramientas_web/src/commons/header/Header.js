import React, { Component } from 'react'

class Header extends Component {
	constructor(props) {
    super(props);
    this.props = props;
    this.rows = props.fields;

  }

	render() {

	    return (
        <div className="card pull-up">
          <div className="card-content">
            <div className="card-body">
              <h4 className="form-section">
                <i className={this.props.iconClass}></i> {this.props.title}
              </h4>
             {
              this.rows.map((row, index)=>{
                return(
                  <div key={index} className="row">
                    {row.fields.map((field, index2)=>{
                      return(
                        <div key={index2} className={"col-md-"+ (12 / row.fields.length)}>
                          <div className="form-group row">
                            <label className={"col-md-" + row.labelCols + " label-control col-form-label"}>{field.label ? field.label + ':' : '' }</label>
                            <div className={"col-md-" + row.valueCols} >
                              <div className="form-control-static col-form-label form-value">{field.value ? field.value : ''}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
	    );
  	}
}

export default Header;