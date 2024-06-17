"use client";

import { useEffect, useState } from "react";

import Row from "./Row";
import { data } from "./data";
import { twMerge } from "tailwind-merge";

export default function Home() {
  const [checked, setChecked] = useState([]);
  const [stakingAmount, setStakingAmount] = useState(0);
  const [dataArr, setDataArr] = useState([]);
  const [sortingCriteria, setSortingCriteria] = useState(0);

  useEffect(() => {
    console.log(dataArr);
    const initialDataArr = sortByMetricKey(data, "reward_rate");
    setDataArr(initialDataArr);
  }, []);

  const getAuMValue = (id) => {
    const asset = dataArr.find((a) => a.id === id);

    return asset.metrics.filter(
      (metric) => metric.metricKey === "assets_under_management"
    )[0].defaultValue;
  };

  const getAuMSum = () => {
    let sum = 0;
    for (let i = 0; i < checked.length; i++) {
      sum += getAuMValue(checked[i]);
    }
    return sum
      .toFixed(0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const sortByMetricKey = (array, key) => {
    return array
      .slice()
      .sort((a, b) => {
        const aMetric = a.metrics.find((metric) => metric.metricKey === key);
        const bMetric = b.metrics.find((metric) => metric.metricKey === key);

        if (!aMetric && !bMetric) return 0;
        if (!aMetric) return 1;
        if (!bMetric) return -1;

        return aMetric.defaultValue - bMetric.defaultValue;
      })
      .reverse();
  };

  const handleInput = (e) => {
    setStakingAmount(e.target.value);
  };

  const handleSorting = (s) => {
    // 0 = Reward Rate
    // 1 = AuM
    setSortingCriteria(s);
    const sortedArr = sortByMetricKey(
      dataArr,
      s === 0 ? "reward_rate" : "assets_under_management"
    );
    setDataArr(sortedArr);
  };

  return (
    <div className="w-screen h-screen flex flex-col gap-4 items-center justify-center bg-gray-200">
      <div className="w-[75%] flex items-center gap-6">
        <div className="text-base font-bold">Reward options</div>
        <div className="flex items-center gap-2">
          <div className="text-sm">Sort by:</div>
          <div
            className={twMerge(
              "text-sm text-white p-2 bg-gray-500 rounded-md hover:cursor-pointer",
              sortingCriteria === 0 ? "" : "bg-inherit text-black"
            )}
            onClick={() => handleSorting(0)}
          >
            Reward Rate
          </div>
          <div
            className={twMerge(
              "text-sm text-white p-2 bg-gray-500 rounded-md hover:cursor-pointer",
              sortingCriteria === 1 ? "" : "bg-inherit text-black"
            )}
            onClick={() => handleSorting(1)}
          >
            AuM
          </div>
        </div>
      </div>
      <div className="w-[75%] flex items-center gap-2">
        <div className="text-sm font-bold">Staking amount</div>
        <div>
          <input type="number" value={stakingAmount} onChange={handleInput} />
        </div>
      </div>
      <div className="w-[75%] flex flex-col gap-2">
        {dataArr.map((asset, index) => (
          <Row
            key={asset.id}
            asset={asset}
            index={index}
            stakingAmount={stakingAmount}
            checkFn={setChecked}
          />
        ))}
      </div>
      <div className="w-[75%] flex float-right items-center gap-2 border">
        <span className="text-sm font-bold">Selected AuM: </span>
        {getAuMSum()}
      </div>
    </div>
  );
}
