import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import queryString from "query-string";

import toNiceDate from "../../ui/toNiceDate";
import AddedScenarioTableContainer from "./AddedScenarioTableContainer";
import DeletedScenarioTableContainer from "./DeletedScenarioTableContainer";
import DifferentScenarioTableContainer from "./DifferentScenarioTableContainer";
import Page from "../../ui/components/Page";
import TestRunDiffBreadcrumbContainer from "./TestRunDiffBreadcrumbContainer";
import Button from "../../ui/components/Button";

export default class TestRunDiffResultPage extends React.Component {
  static propTypes = {
    testRunId: PropTypes.string.isRequired,
    otherTestRunId: PropTypes.string.isRequired,
    testRun: PropTypes.object,
    otherTestRun: PropTypes.object,
    onLoad: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.loadTestRunDiffResultIfPossible();
  }

  componentDidUpdate(prevProps) {
    this.loadTestRunDiffResultIfPossible(prevProps);
  }

  loadTestRunDiffResultIfPossible(prevProps = {}) {
    const { testRunId, otherTestRunId } = this.props;

    if (testRunId !== prevProps.testRunId || otherTestRunId !== prevProps.otherTestRunId) {
      this.props.onLoad({ testRunId, otherTestRunId });
    }
  }

  render() {
    const { testRun, otherTestRun } = this.props;

    return (
      <Page
        title={`Comparaison contre le tir du ${toNiceDate(testRun.date)}`}
        breadcrumb={<TestRunDiffBreadcrumbContainer />}
        mainline={
          <p>
            Comparaison entre les tirs du <Link to={`/test-runs/${testRun.id}`}>{toNiceDate(testRun.date)}</Link> et du{" "}
            <Link to={`/test-runs/${otherTestRun.id}`}>{toNiceDate(otherTestRun.date)}</Link>
            <Button
              icon={faExchangeAlt}
              variant="outline-secondary"
              size="sm"
              className="ml-3"
              as={Link}
              to={{
                pathname: `/test-runs/${otherTestRun.id}/diff`,
                search: queryString.stringify({
                  otherTestRunId: testRun.id
                })
              }}
              replace
            >
              Inverser
            </Button>
          </p>
        }
      >
        <h2>Différences constatées</h2>

        <h3>Scénarios ajoutés</h3>
        <AddedScenarioTableContainer />

        <h3>Scénarios supprimés</h3>
        <DeletedScenarioTableContainer />

        <h3>Scénarios dont le statut a changé</h3>
        <DifferentScenarioTableContainer />
      </Page>
    );
  }
}
