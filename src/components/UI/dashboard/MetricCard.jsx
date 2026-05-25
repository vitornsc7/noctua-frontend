import React from 'react';
import Card from '../Card';

const MetricCard = ({ title, value, description, icon, accentClass = 'bg-primary/10 text-primary' }) => {
    return (
        <Card>
            <div className="flex flex-col min-h-[150px] items-center justify-center gap-2">
                {icon && (
                    <div className={`flex flex-row items-center gap-2`}>
                        <i className={`${icon} text-gray-500 text-md`} />
                        <p className="text-md font-medium text-gray-500">{title}</p>
                    </div>
                )}
                <div>
                    <p className="text-3xl font-bold leading-none text-secondary">{value}</p>
                </div>

                {description && (
                    <p className="text-sm text-gray-400">{description}</p>
                )}
            </div>
        </Card>
    );
};

export default MetricCard;
