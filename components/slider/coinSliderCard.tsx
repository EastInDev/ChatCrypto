import MilBilCal from "../../functions/milBilCal";
import Image from "next/image";
import LoadingComponent from "../loading/loading";

type Props = {
  data: any; // 여기서 받는 data는 부모 컴포넌트에서 전달하는 초기 코인 데이터를 의미합니다.
  isLoading: boolean; // 로딩 상태를 나타내는 prop을 추가합니다.
};

const CoinSliderCard: React.FC<Props> = ({ data, isLoading }) => {
  return (
    <div className="bg-white rounded-lg my-5 mx-10 min-w-full">
      {isLoading ? (
        // 로딩 상태일 때는 컨텐츠 대신 로딩 컴포넌트를 카드 내부에서 표시합니다.
        <div className="flex justify-center items-center h-full">
          <LoadingComponent
            height="60px"
            width="10px"
            color="#ff9900"
            radius="4px"
          />
        </div>
      ) : (
        // 로딩이 완료되면 실제 컨텐츠를 표시합니다.
        <>
          <div className="flex flex-row items-center justify-between px-3 pt-3">
            <div className="flex flex-row items-center">
              <Image
                alt=""
                src={data?.data?.coin.iconUrl}
                width={32}
                height={32}
              />{" "}
              <h3 className="font-bold">{data?.data?.coin.symbol}</h3>
            </div>
            <div
              className={
                data?.data?.coin.change > 0
                  ? "bg-green-400 rounded-md px-1"
                  : "bg-red-400 rounded-md px-1"
              }
            >
              <h3 className="font-bold text-white text-sm">
                {data?.data?.coin.change + "%"}
              </h3>{" "}
            </div>
          </div>

          <div className="p-3 flex flex-col">
            <h3 className="font-bold text-lg">
              {parseFloat(data?.data?.coin.price) < 100
                ? parseFloat(data?.data?.coin.price).toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  }) +
                  " " +
                  "$"
                : parseFloat(data?.data?.coin.price).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  }) +
                  " " +
                  "$"}
            </h3>
            <h3 className="text-sm text-gray-500 py-2">
              {"24H Turnover" +
                " " +
                MilBilCal(data?.data?.coin["24hVolume"]) +
                "[USD]"}{" "}
            </h3>
          </div>
          <div className="h-30">
            <hr className="bg-black" />
            <h3 className="font-bold text-lg pl-5 pr-16 py-2">Description</h3>
            <div className="flex flex-row">
              <h3
                className="font-bold text-sm pl-5 pr-16 py-2"
                dangerouslySetInnerHTML={{
                  __html: data?.data?.coin.description,
                }}
              ></h3>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoinSliderCard;
