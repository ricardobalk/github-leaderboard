import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//   {
//     name: 'Page A',
//     commits: 2400,
//   },
//   {
//     name: 'Page B',
//     commits: 1398,
//   },
//   {
//     name: 'Page C',
//     commits: 9800,
//   },
//   {
//     name: 'Page D',
//     commits: 3908,
//   },
//   {
//     name: 'Page E',
//     commits: 4800,
//   },
//   {
//     name: 'Page F',
//     commits: 3800,
//   },
//   {
//     name: 'Page G',
//     commits: 4300,
//   },
// ];

export default function Chart({data}) {
    return (
      <div style={{width: '1000px', height: '500px'}}>
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={20}
        >
          <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="commits" fill="#8884d8" background={{ fill: '#eee' }} />
        </BarChart>
      </ResponsiveContainer>
      </div>
    );
}
