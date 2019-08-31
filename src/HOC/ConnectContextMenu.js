import React from 'react';
import listener from 'react-contextmenu/modules/globalEventListener';

export default function connectMenu(id) {
  return function connectMenuWrapper(Child) {
    return class ConnectMenu extends React.Component {
      constructor(props) {
        super(props);
        this.state = { item: null };
        this.handleShow = this.handleShow.bind(this);
        this.handleHide = this.handleHide.bind(this);
      }

      componentDidMount() {
        this.listenId = listener.register(this.handleShow, this.handleHide);
      }

      componentWillUnmount() {
        if (this.listenId) {
          listener.unregister(this.listenId);
        }
      }

      handleShow(e) {
        if (e.detail.id !== id) return;
        // Don't include attributes, children or the collect function in the state.
        const filteredData = {};
        for (const key in e.detail.data) {
          if (['attributes', 'children', 'collect'].indexOf(key) === -1) {
            filteredData[key] = e.detail.data[key];
          }
        }
        this.setState({ item: filteredData });
      }

      handleHide() {
        this.setState({ item: null });
      }

      render() {
        return <Child {...this.props} {...this.state} />;
      }
    };
  };
}
