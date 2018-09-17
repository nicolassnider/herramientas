import React, { Component } from 'react'

class Loading extends Component {
	constructor(props) {
		super(props);

		this.hideSpinner = props.hideSpinner === true;

		this.divStyle = {
			position: 'fixed',
			top: 0,
			left: 0,
			height: '100%',
			width: '100%',
			zIndex: 9998
		};

		this.spinner = {
			position: 'fixed',
			top: 20,
			right: 4,
			zIndex: 9999
		};
	}

	render() {
		return (
			<React.Fragment>
				<div style={this.divStyle}></div>
				<i className="fa fa-spinner spinner fa-2x" style={this.spinner} hidden={this.hideSpinner}></i>
			</React.Fragment>
		);
	}
}

export default Loading;