"use client";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useStateContext } from "@/app/StateContext";
import { useGetDonorStatistic } from "../../../hooks/donor-hook";
 
const options = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3", "#80CAEE"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
    max: 100,
  },
};

const ChartOne = () => {
  const { user } = useStateContext();
  const { data, isLoading, error } = useGetDonorStatistic(user?.userId);
  console.log("chartOne")
  console.log(data)
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  // useEffect(() => {
  //   if (data && data.monthlyDonations ) {
  //     const totalDonated = data.monthlyDonations;
  //     const monthsData = [
  //       "Jan",
  //       "Feb",
  //       "Mar",
  //       "Apr",
  //       "May",
  //       "Jun",
  //       "Jul",
  //       "Aug",
  //       "Sep",
  //       "Oct",
  //       "Nov",
  //       "Dec",
        
  //     ];

  //     setSeries([
  //       { name: "Total Donated", data: totalDonated },
  //     ]);
  //     setCategories(monthsData);
  //   }
  // }, [data]);
  useEffect(() => {
    if (data && data.monthlyDonations) {
      const formattedMonthlyDonations = data.monthlyDonations.map(amount => 
        parseFloat(amount.toFixed(2)) // This will keep only 2 decimal places
      );
      
      setSeries([{ 
        name: "Total Donated", 
        data: formattedMonthlyDonations 
      }]);
      setCategories([
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ]);
    }
  }, [data]);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7 pb-5 shadow-sm sm:px-7 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div></div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-[#f5f7fd] p-1 ">

            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white ">
              Month
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5 h-[355px] w-[105%]">
          <ReactApexChart
            options={{
              ...options,
              xaxis: {
                ...options.xaxis,
                categories: categories,
              },
            }}
            series={series}
            type="area"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
