import OpenSeaDragon from "openseadragon";
import React from "react";
import { getParamConfig } from "./functions";

export default class ImageIIF extends React.Component {
  constructor(props) {
    super(props);
    this.viewer = null;
  }

  componentDidUpdate() {
    this.viewer.close();
    let tileSources = {
      type: "image",
      url: this.props.url + "/full/full/0/default.jpg",
      crossOriginPolicy: "Anonymous",
      ajaxWithCredentials: false
    };
    this.viewer.open(tileSources);
  }
  componentDidMount() {
    this.viewer = OpenSeaDragon({
      id: this.props.id,
      prefixUrl: getParamConfig("web_url") + "/images/",
      tileSources: {
        type: "image",
        url: this.props.url + "/full/full/0/default.jpg",
        crossOriginPolicy: "Anonymous",
        ajaxWithCredentials: false
      },
      showRotationControl: true,
      // Enable touch rotation on tactile devices
      gestureSettingsTouch: {
        pinchRotate: true
      }
    });
  }

  render() {
    const style = {
      width: "100%",
      height: "25em",
      maxWidth: "150em"
    };
    return <div id={this.props.id} style={style} />;
  }
}
