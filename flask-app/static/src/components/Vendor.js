import React from "react";

export default class Vendor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
    };

    this.toggleExpand = this.toggleExpand.bind(this);
  }

  formatFoodItems(items) {
    if (this.state.isExpanded) {
      return items.join(", ");
    }
    const summary = items.join(", ").substr(0, 80);
    if (summary.length > 70) {
      const indexOfLastSpace =
        summary.split("").reverse().join("").indexOf(",") + 1;
      return summary.substr(0, 80 - indexOfLastSpace) + " & more...";
    }
    return summary;
  }

  toggleExpand() {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  }

  render() {
    const { name, branches, fooditems, drinks } = this.props.data;
    const servesDrinks = (
      <div className="row">
        <div className="icons">
          {" "}
          <i className="ion-wineglass"></i>{" "}
        </div>
        <div className="content">Serves Cold Drinks</div>
      </div>
    );

    return (
      <li
        onMouseEnter={this.props.handleHover.bind(null, name)}
        onClick={this.toggleExpand}
      >
        <p className="truck-name">{name}</p>
        <div className="row">
          <div className="icons">
            {" "}
            <i className="ion-android-pin"></i>{" "}
          </div>
          <div className="content"> {branches.length} locations </div>
        </div>
        {drinks ? servesDrinks : null}
        <div className="row">
          <div className="icons">
            {" "}
            <i className="ion-fork"></i> <i className="ion-spoon"></i>
          </div>
          <div className="content">
            Serves {this.formatFoodItems(fooditems)}
          </div>
        </div>
      </li>
    );
  }
}
