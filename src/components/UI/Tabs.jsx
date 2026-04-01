import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const TabPanel = () => null;

const Tabs = ({
    children,
    activeTab,
    defaultTab,
    onTabChange,
    className = '',
}) => {
    const panels = useMemo(
        () =>
            React.Children.toArray(children).filter(
                (child) => React.isValidElement(child) && child.type === TabPanel,
            ),
        [children],
    );

    const firstId = panels[0]?.props.id ?? null;

    const [internalTab, setInternalTab] = useState(defaultTab ?? firstId);
    const isControlled = activeTab !== undefined;
    const currentTab = isControlled ? activeTab : internalTab;

    const handleTabChange = (id) => {
        if (!isControlled) {
            setInternalTab(id);
        }
        onTabChange?.(id);
    };

    const activePanel = panels.find((p) => p.props.id === currentTab) ?? panels[0];

    if (panels.length === 0) {
        return null;
    }

    return (
        <div className={className}>
            <div className="flex border-b border-gray-200">
                {panels.map((panel) => {
                    const { id, label, icon } = panel.props;
                    const isActive = id === (activePanel?.props.id);

                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => handleTabChange(id)}
                            className={[
                                'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors focus:outline-none',
                                isActive
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            ].join(' ')}
                        >
                            {icon && <span className="text-base leading-none">{icon}</span>}
                            {label}
                        </button>
                    );
                })}
            </div>

            <div className="pt-4">
                {activePanel?.props.children}
            </div>
        </div>
    );
};

Tabs.propTypes = {
    children: PropTypes.node.isRequired,
    activeTab: PropTypes.string,
    defaultTab: PropTypes.string,
    onTabChange: PropTypes.func,
    className: PropTypes.string,
};

TabPanel.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    icon: PropTypes.node,
    children: PropTypes.node,
};

Tabs.Tab = TabPanel;

export default Tabs;
