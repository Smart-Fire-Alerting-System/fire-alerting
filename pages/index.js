import { Chart } from "primereact/chart";
import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { ProductService } from "../demo/service/ProductService";
import { LayoutContext } from "../layout/context/layoutcontext";
import { InputSwitch } from "primereact/inputswitch";
import { Slider } from "primereact/slider";
import { InputText } from "primereact/inputtext";

import { Table, Tag } from "antd";

import {
  getTemperature,
  getHumidity,
  getFan,
  getLed,
  getLast7DaysHumidity,
  getLast7DaysTemperatures,
  getLast7DaysTempAndHumids,
  getWarnings,
  setLight,
  setFan,
} from "./api/api";

const socket = io("http://localhost:5000");

const Dashboard = () => {
  var temperatureData = 0;
  getTemperature().then((res) => {
    temperatureData = res.data.value;
  });
  // const humidityData = getHumidity().then((res) => {
  //   return res.data.value;
  // });;
  // const fanData = getFan().then((res) => {
  //   return res.data.value;
  // });;
  // const ledData = getLed().then((res) => {
  //   return res.data.value;
  // });;

  const [products, setProducts] = useState(null);
  const [date, setLastDate] = useState([]);

  const [lineOptions, setLineOptions] = useState(null);
  const { layoutConfig } = useContext(LayoutContext);

  const [humidData, setHumidData] = useState([]);
  const [realtimeTemperature, setRealtimeTemperature] = useState(null);
  const [realtimeHumidity, setRealtimeHumidity] = useState(null);
  const [realtimeFan, setRealtimeFan] = useState(null);
  const [realtimeLed, setRealtimeLed] = useState(null);
  const [weekTemp, setWeekTemp] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [warnings, setWarnings] = useState(null);
  const [last7DaysTempAndHumids, setLast7DaysTempAndHumids] = useState([]);
  
  useEffect(() => {
    formatDataTable();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getTemperature();

      setRealtimeTemperature(response.data.value);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getHumidity();

      setRealtimeHumidity(response.data.value);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getFan();
      setRealtimeFan(response.data.value);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getLed();
      setRealtimeLed(response.data.value);
    };

    fetchData();
  }, []);
  //date in week
  useEffect(() => {
    const fetchDataDay = async () => {
      const response = await getLast7DaysTemperatures();

      setLastDate(
        response.data.data.map((item) => {
          return item.dow;
        })
      );
    };

    fetchDataDay();
  }, []);

  //temp in week
  useEffect(() => {
    const fetchData = async () => {
      const response = await getLast7DaysTemperatures();

      setWeekTemp(response.data.data);
    };

    fetchData();
  }, []);
  const formatDataTable = async () => {
    try {
      const response = await getLast7DaysTemperatures();

      const newDataTable = response.data.data.map((item, key) => {
        console.log("item ", item);
        return {
          id: key,
          temp: item.value,
          date: item.dow,
          humid: "",
        };
      });
      setDataTable(newDataTable);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  // last 7 days temp and humid
  useEffect(() => {
    const fetchData = async () => {
      const response = await getLast7DaysTempAndHumids();
      // console.log('responseTempAndHumid: ', response);
      console.log("responseTempAndHumid data: ", response.data);
      setLast7DaysTempAndHumids(response.data);
      // console.log('last7DaysTempAndHumids: ', last7DaysTempAndHumids);
    };

    fetchData();
  }, []);

  // warnings
  useEffect(() => {
    const fetchData = async () => {
      const response = await getWarnings();
      console.log("warnings: ", response.data.warning_times);
      setWarnings(response.data.warning_times);
    };

    fetchData();
  }, []);

  //humid in weed
  useEffect(() => {
    const fetchData = async () => {
      const response = await getLast7DaysHumidity();
      setHumidData(response.data.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    socket.on("temperatureUpdate", ({ temperature }) => {
      console.log(`Temperature: ${temperature}°C`);
      setRealtimeTemperature(temperature);
    });

    socket.on("humidityUpdate", ({ humidity }) => {
      setRealtimeHumidity(humidity);
      console.log(`humidityUpdate: ${humidity}`);
    });

    socket.on("fanUpdate", ({ fan }) => {
      setRealtimeFan(fan);
      console.log(`fanUpdate: ${data}`);
    });

    socket.on("ledUpdate", ({ led }) => {
      setRealtimeLed(led);
      console.log(`ledUpdate: ${led}`);
    });
  }, []);

 
  const handleToggleFan = (value, e) => {
    setFan({ value: realtimeFan.toString() });
  };

  const handleToggleLed = (value) => {
    setRealtimeLed(value == true ? 1 : 0);
    setLight({ value: sendData.toString() });
  };

  const series = {
    labels: date,
    datasets: [
      {
        label: "humid",
        data: [
          parseFloat(humidData[0]?.value),
          parseFloat(humidData[1]?.value),
          parseFloat(humidData[2]?.value),
          parseFloat(humidData[3]?.value),
          parseFloat(humidData[4]?.value),
          parseFloat(humidData[5]?.value),
          parseFloat(humidData[6]?.value),
        ],
        fill: false,
        backgroundColor: "#00bb7e",
        borderColor: "#00bb7e",
        tension: 0.4,
      },
      {
        label: "temp",
        data: [
          parseFloat(weekTemp[0]?.value),
          parseFloat(weekTemp[1]?.value),
          parseFloat(weekTemp[2]?.value),
          parseFloat(weekTemp[3]?.value),
          parseFloat(weekTemp[4]?.value),
          parseFloat(weekTemp[5]?.value),
          parseFloat(weekTemp[6]?.value),
        ],
        fill: false,
        backgroundColor: "#2f4860",
        borderColor: "#2f4860",
        tension: 0.4,
      },
    ],
  };

  const applyLightTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
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
            color: "#ebedef",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#ebedef",
          },
          grid: {
            color: "rgba(160, 167, 181, .3)",
          },
        },
        y: {
          ticks: {
            color: "#ebedef",
          },
          grid: {
            color: "rgba(160, 167, 181, .3)",
          },
        },
      },
    };

    setLineOptions(lineOptions);
  };

  useEffect(() => {
    ProductService.getProductsSmall().then((data) => {
      setProducts(data);
    });
  }, []);

  useEffect(() => {
    if (layoutConfig.colorScheme === "light") {
      applyLightTheme();
    } else {
      applyDarkTheme();
    }
  }, [layoutConfig.colorScheme]);
  // console.log('series:', series);
  const columnsT = [
    {
      title: "Date",
      dataIndex: "dow",
      key: "dow",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Temperature",
      dataIndex: "temp",
      key: "temp",
    },
    {
      title: "Humidity",
      dataIndex: "humid",
      key: "humid",
    },
    // {
    //   title: 'Status',
    //   key: 'tags',
    //   dataIndex: 'tags',
    //   render: (_, { tags }) => (
    //     <>
    //       {tags.map((tag) => {
    //         let color = tag.length > 5 ? 'geekblue' : 'green';
    //         if (tag === 'loser') {
    //           color = 'volcano';
    //         }
    //         return (
    //           <Tag
    //             color={color}
    //             key={tag}>
    //             {tag.toUpperCase()}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
  ];
  const dataT = last7DaysTempAndHumids.reverse();
  // const dataT = [
  //   {
  //     key: '1',
  //     name: 'John Brown',
  //     age: 32,
  //     address: 'N',
  //     tags: ['nice', 'developer'],
  //   },
  //   {
  //     key: '2',
  //     name: 'Jim Green',
  //     age: 42,
  //     address: 'L',
  //     tags: ['loser'],
  //   },
  //   {
  //     key: '3',
  //     name: 'Joe Black',
  //     age: 32,
  //     address: 'S',
  //     tags: ['cool', 'teacher'],
  //   },
  // ];

  return (
    <div className="grid">
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Average Temperature
              </span>
              <div className="text-900 font-medium text-xl">
                {realtimeTemperature}&#x2103;
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-blue-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
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
              <div className="text-900 font-medium text-xl">
                {realtimeHumidity}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-orange-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
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
              <div className="text-900 font-medium text-xl">{warnings}</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-cyan-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
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
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-comment text-purple-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">85 </span>
          <span className="text-500">responded</span>
        </div>
      </div>

      <div className="col-12 xl:col-6">
        <div className="card">
          <Table columns={columnsT} dataSource={dataT} />
        </div>
        <div className="card">
          <div className="flex justify-content-between align-items-center mb-5">
            <h5>Control Devices</h5>
          </div>
          <div className="col-5">
          Fan Control    :{" "}
            <InputText
              value={realtimeFan}
              onChange={(e) => {handleToggleFan(parseInt(e.target.value), 10); console.log(e);}}
            />
            <Slider
              value={realtimeFan}
              onChange={(e) => {setRealtimeFan(e.value); console.log("On CHange", e.value);}}
              onMouseUp={(e) => {console.log("On Mouse Up: ", e); handleToggleFan(e.value); }}
            />
          </div>
          <div className="col-5">
            LED Control    :{" "}
            <InputSwitch
              checked={realtimeLed == 1 ? true : false}
              onChange={(e) => handleToggleLed(e.value)}
            />
          </div>
        </div>
      </div>

      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Temperature and Humidity over the week</h5>
          <Chart type="line" data={series} options={lineOptions} />
          <div>.</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
