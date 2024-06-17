import Image from "next/image";

const Row = ({ asset, index, stakingAmount, checkFn }) => {
  const logoUrl = asset.providers.filter(
    (provider) => provider.type.key === asset.type.key
  )[0].logoUrl;
  const name = asset.providers.filter(
    (provider) => provider.type.key === asset.type.key
  )[0].name;
  const rate = asset.metrics.filter(
    (metric) => metric.metricKey === "reward_rate"
  )[0].defaultValue;
  const aum = asset.metrics.filter(
    (metric) => metric.metricKey === "assets_under_management"
  )[0].defaultValue;

  const handleClick = (e) => {
    const clicked = e.target.checked;

    if (clicked) {
      checkFn((state) => [...state, asset.id]);
    } else {
      checkFn((state) => [...state.filter((id) => id !== asset.id)]);
    }
  };

  const formatRate = (rate) => {
    return rate.toFixed(2) + "%";
  };

  return (
    <div className="flex items-center p-4 border rounded-md bg-white">
      <div className="flex flex-1 items-center gap-5">
        <div className="text-sm font-bold">{index + 1}</div>
        <div>
          <Image src={logoUrl} alt="asset logo" width={32} height={32} />
        </div>
        <div className="w-32 text-sm font-bold">{name}</div>
        <div className="w-32 p-2 bg-gray-200 rounded-md">
          <div className="text-gray-500 text-sm">Reward Rate</div>
          <div className="text-sm font-bold">{formatRate(rate)}</div>
        </div>
        <div className="w-52">
          <div className="text-gray-500 text-sm">AuM</div>
          <div className="text-sm font-bold">
            $
            {aum
              .toFixed(0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Rewards</div>
          <div className="text-sm font-bold">
            ${((rate * stakingAmount) / 100).toFixed(0)}
          </div>
        </div>
      </div>
      <div className="w-10 flex justify-center">
        <input type="checkbox" onChange={handleClick} />
      </div>
    </div>
  );
};

export default Row;
