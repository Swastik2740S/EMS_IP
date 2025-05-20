import React from 'react';

export default function StatCard(props) {
  const { title, value, icon, color } = props;
  return (
    <div className={color + " p-6 rounded-xl text-white transition-shadow shadow hover:shadow-lg"}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className="bg-white/10 p-3 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}
