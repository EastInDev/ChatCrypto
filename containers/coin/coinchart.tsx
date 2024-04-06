import { useState } from "react";
import { useSelector } from "react-redux";
import { CoinCandle } from "../../components/coin/coin_candle";
import { CoinVolume } from "../../components/coin/coin_volume";
import LoadingComponent from "../../components/loading/loading";
import { CommonRootState } from "../../store/app/store";
import { useGetCryptosQuery } from "../../store/services/cryptoApi";

type Props = {
  width: number | undefined;
  height: number | undefined;
};

export const CoinChart: React.FC<Props> = ({ width, height }) => {
  const { data, isLoading, error } = useGetCryptosQuery("coins");
  const selectData = data?.data?.coins;

  const [defaultLimit, setdefaultLimit] = useState(1000);
  const [dataLength, setDataLength] = useState(900);
  const dataDefaultMinusLength = 18;

  const coinSelecto = useSelector((state: CommonRootState) =>
    state.selectedCoin.coin.replace("*", "")
  );

  //** 마우스 휠 컨트롤러 */
  const dataWheelHandler = () => {
    window.onwheel = function (e) {
      e.deltaY > 0
        ? setDataLength(
            dataLength < dataDefaultMinusLength
              ? dataLength + 0
              : dataLength - 8
          )
        : setDataLength(
            dataLength > defaultLimit ? dataLength + 0 : dataLength + 8
          );
    };
  };

  if (isLoading) {
    return (
      <div className=" w-screen h-screen justify-center items-center">
        <LoadingComponent />
      </div>
    );
  }

  //** */ 데이터 배열 순서 : time, high, low, open, volumeFrom volumeTo, close
  return (
    <div onWheel={dataWheelHandler} style={{ width: 830 }}>
      <CoinCandle
        width={width}
        height={height}
        defaultLimit={defaultLimit}
        dataLength={dataLength}
        name={coinSelecto}
      />
      <CoinVolume
        width={width}
        height={height}
        defaultLimit={defaultLimit}
        dataLength={dataLength}
        name={coinSelecto}
      />
    </div>
  );
};
