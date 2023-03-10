import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
    state = {
        seenIndexes: [], // pulling from postgres so we get back an array.
        values: {}, // pulling from redis so we get back an object.
        index: ''
    };


    componentDidMount() {
        this.fetchValues();
        this.fetchIndexes();
    }

    async fetchIndexes() {
        const seenIndexes = await axios.get('api/values/all');
        this.setState({ seenIndexes: seenIndexes.data });
    }

    async fetchValues() {
        const values = await axios.get('/api/values/current');
        this.setState({values: values.data});
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/values', {
            index: this.state.index
        });
        this.setState({index: ''});
    };

    renderSeenIndexes () {
        return this.state.seenIndexes.map(({ number }) => number).join(', ');
    }

    renderValues () {
        const entries = [];
        for(let key in this.state.values) {
            entries.push(
                <div key = {key}>
                    For index {key}, I calculated {this.state.values[key]}
                </div>
            );
        }
        return entries;
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your fib number :</label>
                    <input
                        value={this.state.index}
                        onChange={event => this.setState({index: event.target.value})} 
                    />
                    <button>Submit</button>
                </form>
                <h3>Indexes I have stored :</h3>
                {this.renderSeenIndexes()}

                <h3>Calculated values for stored indices :</h3>
                {this.renderValues()}
            </div>
        )
    }

}

export default Fib;

