import React from 'react';
import Card from '../Card';

const MetricCard = ({ title, value, description }) => {
    return (
        <Card className="h-full">
            <div className="flex h-full min-h-[150px] flex-col items-center justify-center px-4 text-center">
                <p className="text-[17px] font-medium leading-snug text-gray-500">
                    {title}
                </p>

                <p className="mt-4 text-3xl font-semibold leading-none text-gray-900">
                    {value}
                </p>

                {description && (
                    <p className="mt-4 whitespace-nowrap text-sm leading-snug text-gray-600">
                        {description}
                    </p>
                )}
            </div>
        </Card>
    );
};

export default MetricCard;