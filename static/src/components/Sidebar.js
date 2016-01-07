var React = require('react');
var request = require('superagent');

var Sidebar = React.createClass({
  getInitialState() {
    return { results: [], query: "" }
  },
  fetchResults() {
    var results = [],
        query = this.state.query;
    request
      .get('/search?q=' +  query)
      .end(function(err, res) {
        if (err) {
          alert("error in fetching response");
        }
        else {
          this.setState({ results: res.body });
        }
      }.bind(this));
  },
  handleSearch(e) {
    e.preventDefault();
    this.fetchResults();
  },
  onChange(e) {
    this.setState({query: e.target.value});
  },
  formatFoodItems(items) {
    var s = items.join(",").substr(0, 80);
    if (s.length > 70) {
      var indexOfLastSpace = s.split('').reverse().join('').indexOf(",");
      return s.substr(0, 80 - indexOfLastSpace) + " & more...";
    } else {
      return s;
    }
  },
  render() {
    var query = this.state.query;
    var resultsCount = this.state.results.hits || 0;
    var locationsCount = this.state.results.locations || 0;
    var results = this.state.results.trucks || [];
    var renderedResults = results.map((r, i) => 
      <li key={i}>
        <p className="truck-name">{ r.name }</p>
        <p><i className="ion-android-pin"></i> &nbsp; {r.branches.length} locations</p>
        <p><i className="ion-fork"></i> <i className="ion-spoon"></i> &nbsp; 
          Serves {this.formatFoodItems(r.fooditems)}
        </p>
      </li>
    );
    return (
      <div>
        <div id="search-area">
          <form onSubmit={this.handleSearch}>
            <input type="text" value={query} onChange={this.onChange}
                    placeholder="Burgers, Tacos or Wraps?"/>
            <button>Search!</button>
          </form>
        </div>
        { resultsCount > 0 ?
          <div id="results-area">
            <h5>Found <span className="highlight">{ resultsCount }</span> vendors
              in <span className='highlight'>{ locationsCount}</span> different locations</h5>
            <ul> { renderedResults } </ul>
          </div>
        : null}
      </div>
    );
  }
});

module.exports = Sidebar;
