import React from 'react';

class Panel extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
			height: 0
		};
  }

  componentDidMount() {
		window.setTimeout(() => {
			const el = ReactDOM.findDOMNode(this);
			const height = el.querySelector('.panel__inner').scrollHeight;
			this.setState({
				height
			});
		}, 333);
	}

	render () {
		const { label, content, activeTab, index, activateTab } = this.props;
		const { height } = this.state;
		const isActive = activeTab === index;
		const innerStyle = {
			height: isActive ? `${height}px` : '0px'
		}

		return (
			<div className='panel'
				role='tabpanel'
				aria-expanded={isActive}>
				<button className='panel__label'
					role='tab'
					onClick={activateTab}>
					{label}
				</button>
				<div className='panel__inner'
					style={innerStyle}
					aria-hidden={!isActive}>
					<p className='panel__content'>
						{content}
					</p>
				</div>
			</div>
		);
	}
}

