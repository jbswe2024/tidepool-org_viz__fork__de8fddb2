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

class Table extends React.Component {

  getItemField(item, field) {
    return item[field];
  }

  normalizeColumns() {
    const getItemField = this.getItemField;
    const columns = this.props.columns;

    return columns.map((column) => ({
      key: column.key,
      label: column.label,
      className: column.className,
      cell: getItemField,
    })
    );
  }

  renderHeader(normalizedColumns) {
    const cells = normalizedColumns.map(
      (column) => <th className={column.className}>{column.label}</th>
    );
    return (<thead>{cells}</thead>);
  }

  renderRow(normalizedColumns, rowKey, rowData) {
    const cells = normalizedColumns.map((column) => {
      const theKey = column.key;
      const content = column.cell(rowData, theKey);

      return (<td>{content}</td>);
    });

    return (<tr>{cells}</tr>);
  }

  renderRows(normalizedColumns) {
    const rows = this.props.rows;
    const renderRow = this.renderRow;
    let key = 1;

    const rowData = rows.map((row) => (
      renderRow(normalizedColumns, key++, row)
    ));

    return (<tbody>{rowData}</tbody>);
  }

  render() {
    const normalizedColumns = this.normalizeColumns();

    let tableContents = [
      this.renderHeader(normalizedColumns),
      this.renderRows(normalizedColumns),
    ];

    if (this.props.title) {
      const title = (
        <caption className={this.props.title.className}>{this.props.title.label}</caption>
      );
      tableContents = [
        title,
        this.renderHeader(normalizedColumns),
        this.renderRows(normalizedColumns),
      ];
    }

    return (
      <table className={`${this.props.tableStyle || ''}`}>
        {tableContents}
      </table>
    );
  }
}

Table.propTypes = {
  title: PropTypes.object,
  rows: PropTypes.array,
  columns: PropTypes.array,
  tableStyle: PropTypes.string,
};

export default Table;
