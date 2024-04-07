import MilBilCal from "../functions/milBilCal";
import Image from "next/image";

interface ColumnProps {
  value: string;
}

export const CoinColumns = [
  {
    accessor: "iconUrl",
    Cell: ({ value }: ColumnProps) => (
      <div className=" flex justify-end">
        <Image alt="" src={value} width={20} height={20} />
      </div>
    ),
  },
  {
    accessor: "symbol",
    Cell: ({ value }: ColumnProps) => <h3>{value}</h3>,
  },
  {
    accessor: "price",
    Cell: ({ value }: ColumnProps) => (
      <div className=" flex justify-end">
        <h3>
          {parseFloat(value) < 100
            ? parseFloat(value).toLocaleString(undefined, {
                maximumFractionDigits: 4,
              }) +
              " " +
              "$"
            : parseFloat(value).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              }) +
              " " +
              "$"}
        </h3>
      </div>
    ),
  },
  {
    accessor: "change",
    Cell: ({ value }: ColumnProps) => (
      <div className=" flex justify-end">
        <h3
          className={parseFloat(value) < 0 ? "text-red-600" : "text-green-500"}
        >
          {value + " " + "%"}
        </h3>
      </div>
    ),
  },
  {
    accessor: "volume",
    Cell: ({ value }: ColumnProps) => (
      <div className=" flex justify-end">
        <h3>{MilBilCal(parseFloat(value)) + ["[USD]"]}</h3>
      </div>
    ),
  },
];
