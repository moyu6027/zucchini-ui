import PropTypes from "prop-types";
import React from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

import Status from "../../ui/components/Status";

export default class UnknownScenarioTable extends React.PureComponent {
  static propTypes = {
    scenarios: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  render() {
    const { scenarios } = this.props;

    const rows = scenarios.map((scenario) => {
      return <UnknownScenarioTableRow key={scenario.id} scenario={scenario} />;
    });

    return (
      <Table bordered striped hover>
        <thead>
          <tr>
            <th>Scénario</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  }
}

class UnknownScenarioTableRow extends React.PureComponent {
  static propTypes = {
    scenario: PropTypes.object.isRequired
  };

  render() {
    const { scenario } = this.props;

    return (
      <tr>
        <td>
          <Link to={`/scenarios/${scenario.id}`}>
            <b>{scenario.info.keyword}</b> {scenario.info.name}
          </Link>
        </td>
        <td>
          <Status status={scenario.status} />
        </td>
      </tr>
    );
  }
}
