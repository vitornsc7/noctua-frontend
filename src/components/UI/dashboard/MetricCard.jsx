import React from 'react';
import Card from '../Card';

const MetricCard = ({ title, value, description, icon, accentClass = 'bg-primary/10 text-primary' }) => {
    return (
        <Card className="h-full">
            <div className="flex h-full min-h-[150px] flex-col items-center justify-center gap-3 text-center">
                {icon && (
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClass}`}>
                        <i className={`${icon} text-base`} />
                    </div>
                )}

                <div>
                    <p className="text-[15px] font-medium text-gray-500">{title}</p>
                    <p className="mt-1 text-3xl font-bold leading-none text-gray-800">{value}</p>
                </div>

                {description && (
                    <p className="text-xs text-gray-400">{description}</p>
                )}
            </div>
        </Card>
    );
};

export default MetricCard;
