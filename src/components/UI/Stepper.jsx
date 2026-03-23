import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const StepperStep = () => null;

const Stepper = ({
    children,
    step,
    defaultStep = 1,
    onStepChange,
    allowStepClick = true,
    showControls = true,
    nextLabel = 'Proximo',
    prevLabel = 'Voltar',
    finishLabel = 'Concluir',
    onFinish,
    className = '',
}) => {
    const steps = useMemo(
        () => React.Children.toArray(children).filter(
            (child) => React.isValidElement(child) && child.type === StepperStep,
        ),
        [children],
    );
    const totalSteps = steps.length;

    const [internalStep, setInternalStep] = useState(defaultStep);
    const isControlled = typeof step === 'number';
    const activeStep = isControlled ? step : internalStep;

    const clampedStep = Math.min(Math.max(activeStep, 1), Math.max(totalSteps, 1));
    const activeIndex = clampedStep - 1;
    const isFirstStep = clampedStep === 1;
    const isLastStep = clampedStep === totalSteps;

    const setStep = (nextStep) => {
        const normalized = Math.min(Math.max(nextStep, 1), Math.max(totalSteps, 1));

        if (!isControlled) {
            setInternalStep(normalized);
        }

        onStepChange?.(normalized);
    };

    const handleNext = () => {
        if (isLastStep) {
            onFinish?.();
            return;
        }

        setStep(clampedStep + 1);
    };

    if (totalSteps === 0) {
        return null;
    }

    return (
        <div className={`space-y-6 ${className}`.trim()}>
            <div className="flex items-center gap-3">
                {steps.map((stepNode, index) => {
                    const title = stepNode.props.title || `Etapa ${index + 1}`;
                    const stepNumber = index + 1;
                    const isActive = stepNumber === clampedStep;

                    const itemClass = `inline-flex items-center gap-2 ${allowStepClick ? 'cursor-pointer' : ''}`.trim();
                    const circleClass = [
                        'inline-flex h-6 w-6 items-center justify-center rounded-full border text-sm border-2 font-semibold transition-colors',
                        isActive ? 'border-primary text-primary text-medium' : '',
                        !isActive ? 'border-gray-400 bg-white text-gray-400' : '',
                    ].join(' ');
                    const labelClass = [
                        'text-sm font-semibold transition-colors',
                        isActive ? 'text-primary' : '',
                        !isActive ? 'text-gray-400' : '',
                    ].join(' ');

                    return (
                        <React.Fragment key={stepNode.key || `step-${index}`}>
                            <button
                                type="button"
                                disabled={!allowStepClick}
                                className={itemClass}
                                onClick={() => allowStepClick && setStep(stepNumber)}
                            >
                                <span className={circleClass}>{stepNumber}</span>
                                <span className={labelClass}>{title}</span>
                            </button>

                            {index < totalSteps - 1 && (
                                <div className={`h-0.5 flex-1 ${stepNumber < clampedStep ? 'bg-primary' : 'bg-gray-300'}`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            <div>
                {steps[activeIndex]?.props.children}
            </div>

            {showControls && (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setStep(clampedStep - 1)}
                        disabled={isFirstStep}
                    >
                        {prevLabel}
                    </Button>
                    <Button variant="primary" onClick={handleNext}>
                        {isLastStep ? finishLabel : nextLabel}
                    </Button>
                </div>
            )}
        </div>
    );
};

Stepper.propTypes = {
    children: PropTypes.node.isRequired,
    step: PropTypes.number,
    defaultStep: PropTypes.number,
    onStepChange: PropTypes.func,
    allowStepClick: PropTypes.bool,
    showControls: PropTypes.bool,
    nextLabel: PropTypes.string,
    prevLabel: PropTypes.string,
    finishLabel: PropTypes.string,
    onFinish: PropTypes.func,
    className: PropTypes.string,
};

StepperStep.propTypes = {
    title: PropTypes.node,
    children: PropTypes.node,
};

Stepper.Step = StepperStep;

export default Stepper;
