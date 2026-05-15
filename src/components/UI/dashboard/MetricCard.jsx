import React from "react";
import Card from "../Card";

const MetricCard = ({ title, value, description, icon, variant = 'blue' }) => {
    const variants = {
        blue: {
            iconBg: 'bg-blue-50',
            iconText: 'text-blue-600',
        },
        green: {
            iconBg: 'bg-emerald-50',
            iconText: 'text-emerald-600',
        },
        purple: {
            iconBg: 'bg-violet-50',
            iconText: 'text-violet-600',
        },
        amber: {
            iconBg: 'bg-amber-50',
            iconText: 'text-amber-600',
        },
    };

    const selectedVariant = variants[variant] || variants.blue;

    return (
        <Card>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-800">{value}</p>

                    {description && (
                        <p className="mt-1 text-xs text-gray-500">{description}</p>
                    )}
                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${selectedVariant.iconBg}`}
                >
                    <i className={`${icon} text-lg ${selectedVariant.iconText}`} />
                </div>
            </div>
        </Card>
    );
};

export default MetricCard;