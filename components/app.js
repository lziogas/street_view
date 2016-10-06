import React, { Component } from 'react'
import Dropdown from '../components/dropdown.js'

class App extends Component {
	constructor (props) {
		super(props);
		this.state = {regions : [], stopCount: [], stops: [], show: false};
		this.handleClick = this.handleClick.bind(this);
		this.changeStop = this.changeStop.bind(this);
	}

	handleClick() {
		const stopCount = this.refs.stopCount.state.value;
		const region = this.refs.region.state.value;

		fetch("/data", {
		  method: "POST",
		  body: JSON.stringify( {stopcount: stopCount, region: region}),
		  headers: new Headers({
			'Content-Type': 'application/json'
		  })
		}).then((response) => {
			return response.json()
		}).then((data) => {
		    this.setState({stops: data, show: true});
		});
	}

	changeStop() {
		initialize(this.state.stops.stops[0].Coordinate);
	}

	componentDidMount() {
		const stopCount = [30, 40, 50, 60, 70, 80, 90, 100];
		fetch('/data', {
			method: 'GET'
		}).then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({stopCount: stopCount, regions: data.regions});
		}).catch(function(err) {
			console.log(err);
		});	
    }

	render() {
		return <div>
				 <Dropdown ref='stopCount' data={this.state.stopCount} />
				 <Dropdown ref='region' data={this.state.regions} />
				 <button onClick={this.handleClick}>Submit</button>
				 <button onClick={this.changeStop}>Prev</button>
				 <button onClick={this.changeStop}>Next</button>
			   </div>
	}
}

export default App

