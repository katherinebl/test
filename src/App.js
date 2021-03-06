import React, { Component } from 'react';
import {getPersons} from './services/peopleService';
import {Switch, Route} from 'react-router-dom';
import Filter from './components/Filter';
import BlackList from './components/BlackList';
import BlackCard from './components/BlackCard';
import './App.scss';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      query: '',
      results: this.getSavedData()
    };
    this.getQuery = this.getQuery.bind(this);
  }

  getQuery(e) {
    const userQuery = e.currentTarget.value;
    this.setState({
      query : userQuery
    })
  }

  filterThis() {
    const filteredResults = this.state.results.filter(item => {
      const fullName = `${item.name.first} ${item.name.last}`;
      if (fullName.toUpperCase().includes(this.state.query.toUpperCase())) {
        return true;
      } else {
        return false;
      }
    });
    return filteredResults;
  }

  saveData(newResults) {
    localStorage.setItem('blackData', JSON.stringify(newResults));
  }

  getSavedData() {
    const blackData = localStorage.getItem('blackData');

    if (blackData !== null) {
      return JSON.parse(blackData);
    } else {
      this.getPeople();
      return [];
    }
  }
    
  getPeople(){
    getPersons()
      .then(data => {

        const newResults = data.results.map((item, index) => {return {...item, id: index}});

        this.setState({
          results : newResults
        });
        this.saveData(newResults);
      });
  }

  render() {
    const blackResults = this.filterThis();
    const {results} = this.state;
    return (
      <div className="app">

        <header className="app__header">
          <h1 className="app__title">The Black List of Employees</h1>
          <Switch>
            <Route exact path="/" render={() => <Filter keyUpAction={this.getQuery}/> }/>
          </Switch>
        </header>

        <main className="app__main">
          <Switch>
            <Route exact path="/" render={() => <BlackList blackResults={blackResults} />}/>
            
            <Route path="/person/:id" render={props => <BlackCard match={props.match} blackResults={results} blackId={0}/>}/>
             
          </Switch>
        </main>

        <footer className="app__footer">
          <p className="footer__text">© Katherine Briceño | Adalab 2019</p>
        </footer>
      </div>
    );
  }
}

export default App;
