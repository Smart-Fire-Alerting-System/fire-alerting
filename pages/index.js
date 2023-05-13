import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../demo/service/ProductService';
import { LayoutContext } from '../layout/context/layoutcontext';

const Dashboard = () => {
  const [products, setProducts] = useState(null);
  const menu1 = useRef(null);
  const menu2 = useRef(null);
  const [lineOptions, setLineOptions] = useState(null);
  const { layoutConfig } = useContext(LayoutContext);
  const [lastData, setLastData] = useState([]);
  const [humidData, setHumidData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://io.adafruit.com/api/v2/HCMUT_IOT/feeds/v1/data'
      );
      const json = await response.json();
      setLastData(json.slice(0, 7));
    };

    fetchData();
  }, []);

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

  const series = {
    labels: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    datasets: [
      {
        label: 'humid',
        data: [
          parseFloat(humidData[6]?.value),
          parseFloat(humidData[5]?.value),
          parseFloat(humidData[4]?.value),
          parseFloat(humidData[3]?.value),
          parseFloat(humidData[2]?.value),
          parseFloat(humidData[1]?.value),
          parseFloat(humidData[0]?.value),
        ],
        fill: false,
        backgroundColor: '#00bb7e',
        borderColor: '#00bb7e',
        tension: 0.4,
      },
      {
        label: 'temp',
        data: [
          parseFloat(lastData[6]?.value),
          parseFloat(lastData[5]?.value),
          parseFloat(lastData[4]?.value),
          parseFloat(lastData[3]?.value),
          parseFloat(lastData[2]?.value),
          parseFloat(lastData[1]?.value),
          parseFloat(lastData[0]?.value),
        ],
        fill: false,
        backgroundColor: '#2f4860',
        borderColor: '#2f4860',
        tension: 0.4,
      },
    ],
  };

  const applyLightTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };

    setLineOptions(lineOptions);
  };

  const applyDarkTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          },
        },
        y: {
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          },
        },
      },
    };

    setLineOptions(lineOptions);
  };

  useEffect(() => {
    ProductService.getProductsSmall().then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    if (layoutConfig.colorScheme === 'light') {
      applyLightTheme();
    } else {
      applyDarkTheme();
    }
  }, [layoutConfig.colorScheme]);

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  return (
    <div className="grid">
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Average Temperature
              </span>
              <div className="text-900 font-medium text-xl">35&#x2103;</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-blue-100 border-round"
              style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-shield text-blue-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">Reduce 24% </span>
          <span className="text-500">since last week</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Average Humidity
              </span>
              <div className="text-900 font-medium text-xl">60</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-orange-100 border-round"
              style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi  text-orange-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">More Stable </span>
          <span className="text-500">than last week</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Warning temperature in day
              </span>
              <div className="text-900 font-medium text-xl">12</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-cyan-100 border-round"
              style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-inbox text-cyan-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">80% </span>
          <span className="text-500">reduce last week</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Comments</span>
              <div className="text-900 font-medium text-xl">152 Unread</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-purple-100 border-round"
              style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-comment text-purple-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">85 </span>
          <span className="text-500">responded</span>
        </div>
      </div>

      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Temperature Update</h5>
          <DataTable
            value={products}
            rows={3}
            paginator
            responsiveLayout="scroll">
            <Column
              field="time"
              header="Time"
              sortable
              style={{ width: '35%' }}
            />
            <Column
              field="price"
              header="Temperature"
              sortable
              style={{ width: '35%' }}
              // body={(data) => formatCurrency(data.price)}
            />
            <Column
              field="price"
              header="Humidity"
              sortable
              style={{ width: '35%' }}
              // body={(data) => formatCurrency(data.price)}
            />
          </DataTable>
        </div>
        <div className="card">
          <div className="flex justify-content-between align-items-center mb-5">
            <h5>Control Devices</h5>
          </div>
        </div>
      </div>

      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Temperature and Humidity over the week</h5>
          <Chart
            type="line"
            data={series}
            options={lineOptions}
          />
          <div>.</div>
          <div>.</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
