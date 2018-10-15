import React, {Component} from 'react';
import './Css/Content.css';

class Content extends Component {

    constructor() {
        super();

        this.state = {
            count: 0,
            number1: 0,
            number2: 0,
            result: 0
        };

        this.handleCountClick = this.handleCountClick.bind(this);
        this.handleResultClick = this.handleResultClick.bind(this);
        this.handleInputChanged = this.handleInputChanged.bind(this);
    }

    componentDidMount() {
        this.setState({
            count: 1
        });
    }

    handleCountClick(e) {
        console.log(e);
        switch (e.target.id) {
            case 'add':
                this.setState({
                    count: this.state.count + 1
                });
                break;

            case 'substract':
                if (this.state.count > 0) {
                    this.setState({
                        count: this.state.count - 1
                    });
                } else {
                    alert("Count igual cero");
                }
                break;

            case 'reset':

                this.setState({
                    count: this.state.count = 0
                });

                break;
            default:
                alert("Error")
                break
        }
        if (e.target.id === 'add') {
            this.setState({
                count: this.state.count + 1
            })
        }
    }

    handleResultClick(e) {
        this.setState({
            result: this.state.number1 + this.state.number2
        });
    }

    handleInputChanged(e) {

        switch (e.target.id) {
            case "number1":
                this.setState({
                    number1: Number(e.target.value)
                });
                break;
            case "number2":
                this.setState({
                        number2: Number(e.target.value)
                    }
                )
        }


    }

    render() {
        return (
            <div className="Content">
                <h2> Counter: {this.state.count}</h2>
                <p>
                    <button id="add" onClick={this.handleCountClick}>+</button>
                    <button id="substract" onClick={this.handleCountClick}>-</button>
                    <button id="reset" onClick={this.handleCountClick}>0</button>

                </p>
                <br/>
                <h2>Calculator</h2>
                <p>
                    <input id="number1" type="number" value={this.state.number1} onChange={this.handleInputChanged}/>
                    +
                    <input id="number2" type="number" value={this.state.number2} onChange={this.handleInputChanged}/>
                    <br/>
                    <button id="result" onClick={this.handleResultClick}>=</button>
                    {this.state.result}

                </p>
            </div>);
    }

}

export default Content;