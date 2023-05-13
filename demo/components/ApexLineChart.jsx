import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';

const chartSettings = {
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    labels: {
      style: {
        colors: '#6B859E',
        opacity: 0.7,
      },
    },
  },
  yaxis: [
    {
      labels: {
        style: {
          colors: ['#6B859E'],
          opacity: 0.7,
        },
      },
    },
    {
      opposite: true,
      labels: {
        style: {
          colors: ['#6B859E'],
          opacity: 0.7,
        },
      },
    },
  ],
  tooltip: {
    x: {
      show: false,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 1,
      stops: [40, 90, 100],
    },
  },
  colors: ['#4D53E0', '#41D5E2'],
  chart: {
    toolbar: {
      show: false,
    },
  },
  legend: {
    show: true,
    horizontalAlign: 'center',
  },
};

const ApexLineChart = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [lastData, setLastData] = useState([]);
  const [humidData, setHumidData] = useState([]);
  useEffect(() => {
    setIsMobile(window.innerWidth <= 767.98);
  }, []);

  useEffect(() => {
    if (isMobile) {
      const fetchData = async () => {
        const response = await fetch(
          'https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v1/data'
        );
        const json = await response.json();
        setLastData(json.slice(0, 7));
      };
      fetchData();
    }
  }, [isMobile]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v2/data'
      );
      const json = await response.json();
      setHumidData(json.slice(0, 7));
    };

    fetchData();
  }, []);

  const series = [
    {
      name: 'temp',
      data: [
        parseFloat(lastData[6]?.value),
        parseFloat(lastData[5]?.value),
        parseFloat(lastData[4]?.value),
        parseFloat(lastData[3]?.value),
        parseFloat(lastData[2]?.value),
        parseFloat(lastData[1]?.value),
        parseFloat(lastData[0]?.value),
      ],
    },
    {
      name: 'Humid',
      data: [
        parseFloat(humidData[6]?.value),
        parseFloat(humidData[5]?.value),
        parseFloat(humidData[4]?.value),
        parseFloat(humidData[3]?.value),
        parseFloat(humidData[2]?.value),
        parseFloat(humidData[1]?.value),
        parseFloat(humidData[0]?.value),
      ],
    },
  ];

  // update
  return (
    <ApexCharts
      options={chartSettings}
      series={series}
      type="area"
      height={300}
    />
  );
};
export default dynamic(() => Promise.resolve(ApexLineChart), { ssr: false });
