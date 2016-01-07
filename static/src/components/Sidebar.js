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
  render() {
    var resultsCount = this.state.results.total || 0;
    var query = this.state.query;
    var results = this.state.results.hits || [];
    var renderedResults = results.map((r, i) => {
      return <li key={i}>
          <p>{ r._source.applicant }</p>
          <span> Located at: { r._source.address }</span>
        </li>
    });
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
            <h5>Showing { resultsCount } results</h5>
            <ul>
              { renderedResults }
            </ul>
          </div>
        : null}
      </div>
    );
  }
});

module.exports = Sidebar;
