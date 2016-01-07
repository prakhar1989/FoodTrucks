var React = require('react');

var Vendor = React.createClass({
    getInitialState() {
        return { isExpanded: false }
    },
    formatFoodItems(items) {
        if (this.state.isExpanded) {
            return items.join(", ");
        } 
        var s = items.join(", ").substr(0, 80);
        if (s.length > 70) {
            var indexOfLastSpace = s.split('').reverse().join('').indexOf(",") + 1;
            return s.substr(0, 80 - indexOfLastSpace) + " & more...";
        } else {
            return s;
        }
    },
    toggleExpand() {
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    },
    render() {
        var r = this.props.data;
        return (
          <li onMouseEnter={this.props.handleHover.bind(null, r.name)} onClick={this.toggleExpand}>
            <p className="truck-name">{ r.name }</p>
            <div className="row">
              <div className="icons"> <i className="ion-android-pin"></i> </div>
              <div className="content"> {r.branches.length} locations </div>
            </div>
            { r.drinks ? 
            <div className="row">
              <div className="icons"> <i className="ion-wineglass"></i> </div>
              <div className="content">Serves Cold Drinks</div>
            </div>
            : null }
            <div className="row">
              <div className="icons"> <i className="ion-fork"></i> <i className="ion-spoon"></i></div>
              <div className="content">Serves {this.formatFoodItems(r.fooditems)}</div>
            </div>
          </li>
       )
    }
});

module.exports = Vendor;
