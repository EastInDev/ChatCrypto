import { useEffect, useState } from "react";
import CoinSliderCard from "../../components/slider/coinSliderCard";
import useInterval from "../../hooks/useInterval";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useGetCryptoDetailsQuery } from "../../store/services/cryptoApi";

type Props = {
  data: any; // 코인 데이터 배열
};

const HomeSlider: React.FC<Props> = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  // 슬라이드 변경에 따라 코인 UUID 업데이트
  const currentCoinUuid = data[currentSlide]?.uuid;

  // 현재 슬라이드에 해당하는 코인의 상세 정보를 가져옴
  const {
    data: coinDetails,
    isFetching,
    isLoading,
  } = useGetCryptoDetailsQuery(currentCoinUuid);

  // 자동 슬라이드 쇼를 위한 인터벌 설정
  useInterval(() => {
    if (!paused) {
      setCurrentSlide(currentSlide === data.length - 1 ? 0 : currentSlide + 1);
    }
  }, 5000);

  // 다음 슬라이드로 이동
  const nextSlide = () => {
    setCurrentSlide(currentSlide === data.length - 1 ? 0 : currentSlide + 1);
  };

  // 이전 슬라이드로 이동
  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? data.length - 1 : currentSlide - 1);
  };

  return (
    <div className="w-10/12">
      <h3 className=" py-5 text-3xl font-extrabold">
        Today Cryptos Transaction Price
      </h3>
      <div
        className="flex flex-row w-10/12 items-center"
        onMouseLeave={() => setPaused(false)}
        onMouseEnter={() => setPaused(true)}
      >
        <button onClick={prevSlide}>
          <FiArrowLeft color="#f7a600" size={"24"} />
        </button>
        <CoinSliderCard
          data={coinDetails}
          isLoading={isLoading || isFetching}
        />
        <button onClick={nextSlide}>
          <FiArrowRight color="#f7a600" size={"24"} />
        </button>
      </div>
    </div>
  );
};

export default HomeSlider;
