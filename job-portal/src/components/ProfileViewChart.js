import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '04/01', views: 300 },
  { name: '04/05', views: 600 },
  { name: '04/10', views: 1000 },
  { name: '04/15', views: 605 },
  { name: '04/20', views: 4029 },
  { name: '04/25', views: 600 },
  { name: '04/30', views: 300 },
];

function ProfileViewChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ProfileViewChart;