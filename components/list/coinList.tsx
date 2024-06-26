import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGlobalFilter, useTable } from "react-table";
import { CommonRootState } from "../../store/app/store";
import { selectedCoin } from "../../store/services/coinSlice";
import { ImCancelCircle } from "react-icons/im";
import { onCoinSelectBtnClicked } from "../../store/services/onClickSlice";

type Props = {
  columns: any;
  data: any;
  onClick: any;
};

export const CoinList: React.FC<Props> = ({ columns, data, onClick }) => {
  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  }: any = useTable(
    {
      columns,
      data,
    },

    useGlobalFilter
  );

  const coinSelecto = useSelector(
    (state: CommonRootState) => state.selectedCoin.coin
  );
  const selectedList = useSelector(
    (state: CommonRootState) => state.CoinSelectBtnClick.coinSelected
  );
  const handleClick = () => {
    dispatch(onCoinSelectBtnClicked(false));
  };
  const onCoinClick = (rowSymbol: string) => {
    dispatch(selectedCoin(rowSymbol));
    dispatch(onCoinSelectBtnClicked(false));
  };
  const dispatch = useDispatch();

  function Search({ onSubmit }: any) {
    const handleSubmit = (event: any) => {
      event.preventDefault();
      onSubmit(event.target.elements.filter.value);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className=" ">
          <input
            name="filter"
            placeholder={"  " + "Search"}
            className=" p-1 bg-chartGray-default border-2 text-white w-full "
          />
        </div>
      </form>
    );
  }

  return (
    <>
      <div
        className={
          " flex flex-col p-5 w-128 transition-opacity ease-in delay-500 h-192 overflow-y-scroll bg-chartGray-default"
        }
      >
        <div className="flex flex-row justify-between pb-5 mb-5">
          <h3 className=" text-white font-bold text-2xl">Crypto Currency</h3>
          <div className="items-center cursor-pointer ">
            <ImCancelCircle color="white" size={25} onClick={handleClick} />
          </div>
        </div>
        <Search onSubmit={setGlobalFilter} />

        <table className=" " {...getTableProps()}>
          <thead className=" text-gray-100 text-right h-14 p-5 text-xs">
            <tr>
              <th className=" text-right">Cont.</th>
              <th></th>
              <th>Price</th>
              <th>Change</th>
              <th>24hVolume</th>
            </tr>
          </thead>
          <tbody {...getTableProps()}>
            {rows.map((row: any, i: number) => {
              prepareRow(row);
              return (
                <tr
                  key={row.id} // 여기에 key prop 추가
                  className="h-14 p-5 text-white cursor-pointer"
                  {...row.getRowProps({
                    onClick: () => {
                      const rowSymbol: string = row.cells[1].value;
                      console.log(rowSymbol);
                      onCoinClick(rowSymbol);
                      console.log(row.cells[1].value);
                      console.log(coinSelecto);
                    },
                  })}
                >
                  {row.cells.map((cell: any, cellIndex: number) => {
                    return (
                      <td key={cellIndex} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td> // 여기에 key prop 추가
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className=" flex flex-row justify-evenly py-5"></div>
      </div>
      )
    </>
  );
};
