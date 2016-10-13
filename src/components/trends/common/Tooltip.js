/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2016, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

import React, { PropTypes } from 'react';
import _ from 'lodash';

import styles from './Tooltip.css';

class Tooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = { offset: { top: 0, left: 0 } };
  }

  componentDidMount() {
    this.calculateOffset();
  }

  calculateOffset() {
    const { offset: propOffset, tail } = this.props;
    const offset = {};
    const tooltipRect = this.element.getBoundingClientRect();
    if (tail) {
      const tailRect = this.tailElem.getBoundingClientRect();
      const tailCenter = {
        top: tailRect.top + (tailRect.height / 2),
        left: tailRect.left + (tailRect.width / 2),
      };
      offset.top = -tailCenter.top + tooltipRect.top + propOffset.top;
      offset.left = -tailCenter.left + tooltipRect.left + propOffset.left;
    } else {
      let leftOffset;
      let topOffset;
      switch (this.props.side) {
        case 'top':
          leftOffset = -tooltipRect.width / 2;
          topOffset = -tooltipRect.height;
          break;
        case 'bottom':
          leftOffset = -tooltipRect.width / 2;
          topOffset = 0;
          break;
        case 'right':
          leftOffset = 0;
          topOffset = -tooltipRect.height / 2;
          break;
        case 'left':
        default:
          leftOffset = -tooltipRect.width;
          topOffset = -tooltipRect.height / 2;
      }
      offset.top = topOffset + propOffset.top;
      offset.left = leftOffset + propOffset.left;
    }

    this.setState({ offset });
  }

  renderTail(color = 'white') {
    const { tailWidth, tailHeight, borderWidth, borderColor, side } = this.props;
    const tailSide = side === 'left' ? 'right' : 'left';
    const padding = 10;
    let marginOuterValue;
    let marginInnerValue;
    if (tailSide === 'left') {
      marginOuterValue = `calc(-100% - 2 * ${padding}px)`;
      marginInnerValue = `calc(-100% - (2 * ${padding}px - ${borderWidth + 1}px))`;
    } else {
      marginOuterValue = `calc(${padding}px + ${borderWidth}px)`;
      marginInnerValue = `${padding - 1}px`;
    }
    const borderSide = tailSide === 'left' ? 'right' : 'left';

    return (<div>
      <div
        ref={(ref) => { this.tailElem = ref; }}
        className={styles.tail}
        style={{
          marginTop: `-${tailHeight}px`,
          marginLeft: marginOuterValue,
          borderWidth: `${tailHeight}px ${2 * tailWidth}px`,
          [`border${_.capitalize(borderSide)}Color`]: borderColor,
        }}
      ></div>
      <div
        className={styles.tail}
        style={{
          marginTop: `-${tailHeight}px`,
          marginLeft: marginInnerValue,
          borderWidth: `${tailHeight}px ${2 * tailWidth}px`,
          [`border${_.capitalize(borderSide)}Color`]: color,
        }}
      ></div>
    </div>);
  }

  renderTitle(title) {
    const { tail, content } = this.props;
    let renderedTitle = null;
    if (title) {
      renderedTitle = (<div className={styles.title}>
        <span>{title}</span>
        {tail && !content && this.renderTail('#EAEAEE')}
      </div>);
    }
    return renderedTitle;
  }

  renderContent(content) {
    let renderedContent = null;
    const { tail } = this.props;
    if (content) {
      renderedContent = (<div className={styles.content}>
        <span>{content}</span>
        {tail && this.renderTail()}
      </div>);
    }
    return renderedContent;
  }

  render() {
    const { title, content, position, borderColor, borderWidth } = this.props;
    const { offset } = this.state;
    const top = position.top + offset.top;
    const left = position.left + offset.left;

    return (
      <div
        className={styles.tooltip}
        style={{ top, left, borderColor, borderWidth: `${borderWidth}px` }}
        ref={(ref) => { this.element = ref; }}
      >
        {title && this.renderTitle(title)}
        {content && this.renderContent(content)}
      </div>
    );
  }
}

Tooltip.propTypes = {
  title: PropTypes.node,
  content: PropTypes.node,
  position: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }),
  offset: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }),
  tail: PropTypes.bool,
  side: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  tailWidth: PropTypes.number,
  tailHeight: PropTypes.number,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
};

Tooltip.defaultProps = {
  tail: true,
  side: 'left',
  tailWidth: 7,
  tailHeight: 8,
  borderColor: 'black',
  borderWidth: 2,
  position: { top: 0, left: 0 },
  offset: { top: 0, left: 0 },
};

export default Tooltip;
