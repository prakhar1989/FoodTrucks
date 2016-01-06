var React = require('react');

var Sidebar = React.createClass({
    render() {
        return <div>
            <input type="text" placeholder="Burgers"/>
            <p>Search to get started</p>
        </div>
    }
});

module.exports = Sidebar;
