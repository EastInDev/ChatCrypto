import React, { useState, useEffect } from "react";
import { dataToArray } from "../../functions/data-to-array";
import MilBilCal from "../../functions/milBilCal";
import { useGetCryptoCompareVolumeQuery } from "../../store/services/cryptoApi";
import LoadingComponent from "../loading/loading";

type VolumeProps = {
  width: number | undefined;
  height: number | undefined;
  defaultLimit: number | undefined;
  dataLength: number | undefined;
  name: string | undefined;
};

export const CoinVolume: React.FC<VolumeProps> = ({
  width,
  height,
  defaultLimit,
  dataLength,
  name,
}) => {
  //***Get data */
  const { data, isLoading, error } = useGetCryptoCompareVolumeQuery({
    limit: defaultLimit,
    coin: name,
  });

  const coinDataArray: any[] | undefined = [];
  const readingData = async () => {
    return !isLoading ? coinDataArray.push(data.Data) : null;
  };
  readingData();
  const coinDummyArray = coinDataArray[0];

  const coinArray: any[] = [];
  coinDummyArray
    ?.slice(dataLength, coinDummyArray.length)
    .forEach((item: any) => coinArray.push(Object.values(item)));

  const time = dataToArray(coinArray, 0);
  const volumeto = dataToArray(coinArray, 1);
  const volumefrom = dataToArray(coinArray, 2);
  const volumetotal = dataToArray(coinArray, 3);

  // let SVG_VOLUME_WIDTH =
  //   typeof width === "number" ? (width > 1500 ? 1500 : width * 1) : 0;
  // let SVG_VOLUME_HEIGHT = 410;

  // 반응형을 위해 useState, useEffect 사용
  const [SVG_VOLUME_WIDTH, setSVG_VOLUME_WIDTH] = useState(
    window.innerWidth > 996 ? 996 : window.innerWidth
  );
  const SVG_VOLUME_HEIGHT = 250;

  // 창 크기에 따라 SVG 너비 조정
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth > 996 ? 996 : window.innerWidth;
      setSVG_VOLUME_WIDTH(currentWidth);
    };

    // 컴포넌트 마운트 시 창 크기 조정 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const xForPrice = 75;
  const xAxisLength = SVG_VOLUME_WIDTH - xForPrice;
  const yAxisLength = SVG_VOLUME_HEIGHT * 0.94;
  const x0 = 0;
  const y0 = 0;

  const xAxisY = y0 + yAxisLength;
  const dateVolume: [string, number, number, number][] = [];
  for (let i = 0; i < time.length; i++) {
    dateVolume.push([time[i], volumeto[i], volumefrom[i], volumetotal[i]]);
  }

  // 배열.reduce((누적값, 현잿값, 인덱스, 요소) => { return 결과 }, 초깃값);

  const dataYMax = dateVolume.reduce(
    (max, [time, volumeto, volumefrom, volumetotal]) =>
      Math.max(max, volumetotal),
    -Infinity
  );
  const dataYMin = dateVolume.reduce(
    (min, [time, volumeto, volumefrom, volumetotal]) =>
      Math.min(min, volumetotal),
    Infinity
  );
  const dataYRange = dataYMax - dataYMin;
  const numYTicks = 5;
  const barPlotWidth = xAxisLength / dateVolume.length;
  // const testYMax = dateVolume.map((item) => Math.max.apply(item[1]), Infinity);

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <div>
      <svg width={SVG_VOLUME_WIDTH} height={SVG_VOLUME_HEIGHT}>
        <line x1={x0} y1={xAxisY} x2={x0 + xAxisLength} y2={xAxisY} />
        <text x={SVG_VOLUME_WIDTH - x0} y={xAxisY + 10}>
          거래량
        </text>

        {Array.from({ length: numYTicks }).map((_, index) => {
          const y = y0 + index * (yAxisLength / numYTicks);
          const yValue = Math.round(
            dataYMax - index * (dataYRange / numYTicks)
          );
          return (
            <g key={index}>
              <line
                className="lineLight"
                x1={SVG_VOLUME_WIDTH - x0}
                x2={x0}
                y1={y}
                y2={y}
              />
              <text
                x={SVG_VOLUME_WIDTH - 60}
                y={y + SVG_VOLUME_HEIGHT * 0.05}
                fontSize="12"
              >
                {MilBilCal(yValue)}
                {/* volume 값 k로 치환
                {Math.abs(yValue) > 999
                  ? Math.sign(yValue) *
                      (Math.round(Math.abs(yValue) / 100) / 10) +
                    "k"
                  : Math.sign(yValue) * Math.abs(yValue)}
                {yValue} */}
              </text>
            </g>
          );
        })}

        {dateVolume.map(([time, volumeto, volumefrom, volumetotal], index) => {
          // x는 바 위치
          const x = x0 + index * barPlotWidth;
          let yRatio = 0;
          const yRatioGenerator = () => {
            yRatio = (volumetotal - dataYMin) / dataYRange;
            if (yRatio > 0) {
              return yRatio;
            } else return (yRatio = volumetotal / dataYRange / 2);
          };
          // const yRatio = (dataY - dataYMin) / dataYRange;
          // y는 바 길이 측정용
          const y = y0 + (1 - yRatioGenerator()) * yAxisLength;
          const height = yRatioGenerator() * yAxisLength;

          const sidePadding = xAxisLength * 0.0015;
          const fill = volumeto > volumefrom ? "#4AFA9A" : "#E33F64";
          return (
            <g key={index}>
              <rect
                {...{ fill }}
                x={x}
                y={y}
                width={barPlotWidth - sidePadding}
                height={height}
              ></rect>
            </g>
          );
        })}
        <line
          x1={SVG_VOLUME_WIDTH - x0}
          y1={y0}
          x2={x0 + xAxisLength}
          y2={y0 + yAxisLength}
        />
      </svg>
    </div>
  );
};
