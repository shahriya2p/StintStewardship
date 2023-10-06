import React, { useCallback, useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Sector,
  RadialBarChart,
  RadialBar,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  AreaChart,
  Area,
} from 'recharts';
import { gql, useQuery } from '@apollo/client';
import './Activity.css';

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor='middle' fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill='none'
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill='#E9D8A6'
      >{`${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill='#ee9b00'
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};
const countPersonal = gql`
  query Query($username: String!) {
    getCountOfPersonalTasks(username: $username)
  }
`;

const countSchool = gql`
  query Query($username: String!) {
    getCountOfSchoolTasks(username: $username)
  }
`;

const countAll = gql`
  query Query($username: String!) {
    getAllCount(username: $username)
  }
`;
const style = {
  top: 100,
  left: 350,
  lineHeight: '24px',
};
const Activity = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [name, setName] = useState('');
  const [countPersData, setCountPersonal] = useState('');
  const [countSchData, setCountSch] = useState('');
  const [countAData, setCountA] = useState('');

  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );
  const countPersonalData = useQuery(countPersonal, {
    variables: {
      username: name,
    },
  });
  const countAllData = useQuery(countAll, {
    variables: {
      username: name,
    },
  });

  const countSchoolData = useQuery(countSchool, {
    variables: {
      username: name,
    },
  });
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const parts = token.split('.');
      const payloadbase = parts[1];
      const payload = JSON.parse(atob(payloadbase));
      setName(payload.username);
    }
    if (countPersonalData.data) {
      let num = 0;
      const countper = countPersonalData.data.getCountOfPersonalTasks.map(
        (number) => {
          num++;
          if (num === 1) {
            return { name: `Todo`, value: number };
          } else if (num === 2) {
            return { name: `Executing`, value: number };
          } else if (num === 3) {
            return { name: `Completed`, value: number };
          } else if (num === 4) {
            return { name: `Review`, value: number };
          } else if (num === 5) {
            return { name: `Finished`, value: number };
          } else {
            return null;
          }
        }
      );
      setCountPersonal(countper);
    }
    if (countSchoolData.data) {
      let num = 0;
      const countsch = countSchoolData.data.getCountOfSchoolTasks.map(
        (number) => {
          num++;
          if (num === 1) {
            return {
              name: `Todo`,
              uv: number,
              pv: (number * 0.3).toFixed(2),
              fill: '#8884d8',
            };
          } else if (num === 2) {
            return {
              name: `Executing`,
              uv: number,
              pv: (number * 0.1).toFixed(2),
              fill: '#83a6ed',
            };
          } else if (num === 3) {
            return {
              name: `Completed`,
              uv: number,
              pv: (number * 0.1).toFixed(2),
              fill: '#8dd1e1',
            };
          } else if (num === 4) {
            return {
              name: `Review`,
              uv: number,
              pv: (number * 0.1).toFixed(2),
              fill: '#82ca9d',
            };
          } else if (num === 5) {
            return {
              name: `Finished`,
              uv: number,
              pv: (number * 0.1).toFixed(2),
              fill: '#a4de6c',
            };
          } else {
            return null;
          }
        }
      );
      setCountSch(countsch);
    }
    if (countAllData.data) {
      let num = 0;
      const countall = countAllData.data.getAllCount.map((arr) => {
        num++;
        if (num === 1) {
          const numb = arr.map((number) => {
            return number;
          });
          return {
            name: 'Todo',
            uv: numb[0],
            pv: numb[1],
            amt: numb[0] + numb[1],
          };
        } else if (num === 2) {
          const numb = arr.map((number) => {
            return number;
          });
          return {
            name: 'Executing',
            uv: numb[0],
            pv: numb[1],
            amt: numb[0] + numb[1],
          };
        } else if (num === 3) {
          const numb = arr.map((number) => {
            return number;
          });
          return {
            name: 'Completed',
            uv: numb[0],
            pv: numb[1],
            amt: numb[0] + numb[1],
          };
        } else if (num === 4) {
          const numb = arr.map((number) => {
            return number;
          });
          return {
            name: 'Review',
            uv: numb[0],
            pv: numb[1],
            amt: numb[0] + numb[1],
          };
        } else if (num === 5) {
          const numb = arr.map((number) => {
            return number;
          });
          return {
            name: 'Finished',
            uv: numb[0],
            pv: numb[1],
            amt: numb[0] + numb[1],
          };
        } else {
          return null;
        }
      });
      setCountA(countall);
    }
  }, [countAllData.data, countPersonalData.data, countSchoolData.data]);

  return (
    <div className='activity'>
      <div className='activity-title'>Check Your Activity Here</div>
      <div
        className='chart'
        style={{
          left: 200,
          width: 'fit-content',
          background: 'black',
          display: 'grid',
          position: 'absolute',
          top: 60,
          opacity: '90%',
          borderRadius: 20,
          boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.34)',
        }}
      >
        <h6
          style={{
            color: '#ee9b00',
            paddingTop: 20,
            textDecoration: 'underline grey',
          }}
        >
          Your Personal Tasks' Activity Goes Here!
        </h6>
        <PieChart width={400} height={300}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={countPersData}
            cx={195}
            cy={150}
            innerRadius={60}
            outerRadius={80}
            fill='#BB3E03'
            dataKey='value'
            onMouseEnter={onPieEnter}
          />
        </PieChart>
      </div>
      <div
        className='chart'
        style={{
          left: 950,
          width: 'fit-content',
          background: 'white',
          display: 'grid',
          position: 'absolute',
          top: 60,
          opacity: '90%',
          borderRadius: 20,
          backgroundColor: 'black',
          boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.34)',
        }}
      >
        <h6
          style={{
            color: '#ee9b00',
            paddingTop: 20,
            textDecoration: 'underline grey',
          }}
        >
          Your School Tasks' Activity Goes Here!
        </h6>
        <RadialBarChart
          width={500}
          height={300}
          cx={150}
          cy={150}
          innerRadius={20}
          outerRadius={140}
          barSize={10}
          data={countSchData}
        >
          <RadialBar
            minAngle={15}
            label={{ position: 'inside', fill: 'black' }}
            background
            clockWise
            className='chart-bar'
            dataKey='uv'
          />
          <Legend
            iconSize={10}
            width={120}
            height={150}
            layout='vertical'
            verticalAlign='middle'
            wrapperStyle={style}
          />
        </RadialBarChart>
      </div>
      <div
        style={{
          background: 'white',
          display: 'flex',
          position: 'absolute',
          bottom: 230,
          borderRadius: 20,
          left: 150,
          padding: 20,
          opacity: '95% ',
          boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.34)',
        }}
      >
        <LineChart
          width={400}
          height={200}
          data={countAData}
          syncId='anyId'
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray='5 5' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Line type='monotone' dataKey='uv' stroke='#8884d8' fill='#8884d8' />
        </LineChart>
        <LineChart
          width={400}
          height={200}
          data={countAData}
          syncId='anyId'
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Line type='monotone' dataKey='pv' stroke='green' fill='white' />
          <Brush />
        </LineChart>
        <AreaChart
          width={500}
          height={200}
          data={countAData}
          syncId='anyId'
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Area type='monotone' dataKey='pv' stroke='black' fill='black' />
        </AreaChart>
      </div>
    </div>
  );
};

export default Activity;
