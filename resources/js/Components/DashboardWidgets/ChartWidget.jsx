import { forwardRef } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const ChartWidget = forwardRef(({
    style,
    className,
    onMouseDown,
    onMouseUp,
    onTouchEnd,
    title,
    subtitle,
    type = 'pie', // pie, bar
    data = [],
    colors = [],
    dataKey = 'value',
    nameKey = 'name',
    height = 300
}, ref) => {

    const renderChart = () => {
        if (type === 'pie') {
            return (
                <div style={{ width: '100%', height: height }}>
                    <ResponsiveContainer width="99%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey={dataKey}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (type === 'bar') {
            return (
                <div style={{ width: '100%', height: height }}>
                    <ResponsiveContainer width="99%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey={nameKey} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            );
        }

        return null;
    };

    return (
        <div
            ref={ref}
            style={style}
            className={`${className} bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col`}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchEnd={onTouchEnd}
        >
            <div className="mb-4">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{title}</h3>
                {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
            </div>

            <div className="flex-1 w-full min-h-0" style={{ minHeight: 200 }}>
                {renderChart()}
            </div>

            {/* Legend/Info if needed */}
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></span>
                        <span>{item[nameKey]}: {item[dataKey]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default ChartWidget;
