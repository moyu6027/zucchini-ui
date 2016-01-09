package example.reporting.scenario;

import example.reporting.api.scenario.AroundAction;
import example.reporting.api.scenario.Scenario;
import example.reporting.api.scenario.ScenarioStatus;
import example.reporting.api.scenario.Step;
import example.reporting.api.scenario.StepStatus;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ScenarioService {

    public void calculateStatusFromSteps(Scenario scenario) {
        final List<StepStatus> innerStatus = new ArrayList<>();
        if (scenario.getBackground() != null) {
            scenario.getBackground().getSteps().stream().map(Step::getStatus).forEach(innerStatus::add);
        }
        scenario.getBeforeActions().stream().map(AroundAction::getStatus).forEach(innerStatus::add);
        scenario.getSteps().stream().map(Step::getStatus).forEach(innerStatus::add);
        scenario.getAfterActions().stream().map(AroundAction::getStatus).forEach(innerStatus::add);

        for (final StepStatus oneInnerStatus : innerStatus) {
            switch (oneInnerStatus) {
                case FAILED:
                case UNDEFINED:
                    scenario.setStatus(ScenarioStatus.FAILED);
                    return;
                case PENDING:
                    scenario.setStatus(ScenarioStatus.PENDING);
                    return;
                default:
                    // Rien à faire, on continue
                    break;
            }
        }

        // Tous les steps ont fonctionné : c'est good !
        if (innerStatus.stream().allMatch(StepStatus.PASSED::equals)) {
            scenario.setStatus(ScenarioStatus.PASSED);
            return;
        }

        // Si tous les steps du scénario sont skipped, alors non joués
        if (scenario.getSteps().stream().map(Step::getStatus).allMatch(StepStatus.SKIPPED::equals)) {
            scenario.setStatus(ScenarioStatus.NOT_RUN);
            return;
        }

        // Si tous les steps du scénario sont non joués, alors non joués
        if (scenario.getSteps().stream().map(Step::getStatus).allMatch(StepStatus.NOT_RUN::equals)) {
            scenario.setStatus(ScenarioStatus.NOT_RUN);
            return;
        }

        scenario.setStatus(ScenarioStatus.FAILED);
    }

    public void changeStatus(Scenario scenario, StepStatus newStatus) {
        if (scenario.getBackground() != null) {
            scenario.getBackground().getSteps().forEach(step -> {
                if (step.getStatus() != newStatus) {
                    step.setStatus(newStatus);
                    step.setErrorMessage(null);
                }
            });
        }

        scenario.getSteps().forEach(step -> {
            if (step.getStatus() != newStatus) {
                step.setStatus(newStatus);
                step.setErrorMessage(null);
            }
        });

        scenario.getBeforeActions().forEach(step -> {
            if (step.getStatus() != newStatus) {
                step.setStatus(newStatus);
                step.setErrorMessage(null);
            }
        });

        scenario.getAfterActions().forEach(step -> {
            if (step.getStatus() != newStatus) {
                step.setStatus(newStatus);
                step.setErrorMessage(null);
            }
        });

        calculateStatusFromSteps(scenario);
    }

}