// components/TopServices.js

import { DataSaleType } from "@models/statistic";
import { handleActionNotSupport } from "@utils/global";
import { Spin } from "antd";
import { AiOutlineBarChart, AiFillTag } from "react-icons/ai";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { PiExport } from "react-icons/pi";
import { formatToTwoDecimalPlaces } from "../../utils/helpers";

interface Props {
  statisticSale: DataSaleType;
  selectedSearchDateSale: string;
  setSelectedSearchDateSale: (value: string) => void;
  isLoadingDateSale: boolean;
}

const TodaySalesSummary: React.FC<Props> = (props) => {
  const {
    statisticSale,
    selectedSearchDateSale,
    setSelectedSearchDateSale,
    isLoadingDateSale,
  } = props;
  const summaryData = [
    {
      icon: <AiOutlineBarChart size={24} color="white" />,
      iconBackGroundColor: "#fb597e",
      value: `${statisticSale?.income.totalIncomeCurrent.toLocaleString()} VNĐ`,
      label: "Tổng doanh số",
      scale: formatToTwoDecimalPlaces(statisticSale?.income.differencePercent),
      backGroundColor: "#ffe2e6",
    },
    {
      icon: <AiFillTag size={24} color="white" />,
      iconBackGroundColor: "#3cd856",
      value: statisticSale?.courses.totalCoursesCurrent.toString(),
      label: "Khoá học đã bán",
      scale: formatToTwoDecimalPlaces(statisticSale?.courses.differencePercent),
      backGroundColor: "#dcfce7",
    },
    {
      icon: <BsFillPersonPlusFill size={24} color="white" />,
      iconBackGroundColor: "#bf84ff",
      value: statisticSale?.newUsers.totalNewUsersCurrent.toString(),
      label: "Khách hàng mới",
      scale: formatToTwoDecimalPlaces(
        statisticSale?.newUsers.differencePercent
      ),
      backGroundColor: "#f4e8fe",
    },
  ];

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSearchDateSale(event.target.value);
  };

  const renderCard = (item: any, key: any) => {
    return (
      <div
        className="summary_card"
        style={{ backgroundColor: item.backGroundColor }}
        key={key}
      >
        <div
          className="summary_card_icon"
          style={{ backgroundColor: item.iconBackGroundColor }}
        >
          {item.icon}
        </div>
        <div className="summary_card_value">{item.value}</div>
        <div className="summary_card_label">{item.label}</div>
        <div className="summary_card_scale">
          {item.scale}% so với {renderComparisonText()}
        </div>
      </div>
    );
  };

  const renderComparisonText = () => {
    switch (selectedSearchDateSale) {
      case "today":
        return "hôm qua";
      case "week":
        return "tuần trước";
      case "month":
        return "tháng trước";
      case "year":
        return "năm trước";
      default:
        return "khoảng thời gian trước đó";
    }
  };

  return (
    <>
      <div className="summary_header">
        <select
          className="cursor-pointer"
          value={selectedSearchDateSale}
          onChange={handleDateChange}
          style={{ fontSize: "20px", fontWeight: "bold", color: "#004c4c" }}
        >
          <option value="today" className="cursor-pointer">
            Doanh số hôm nay
          </option>
          <option value="week" className="cursor-pointer">
            Doanh số tuần này
          </option>
          <option value="month" className="cursor-pointer">
            Doanh số tháng này
          </option>
          <option value="year" className="cursor-pointer">
            Doanh số năm nay
          </option>
        </select>

        <button onClick={handleActionNotSupport}>
          {" "}
          <PiExport />
          Xuất
        </button>
      </div>
      {isLoadingDateSale ? (
        <Spin />
      ) : (
        <div className="summary_item_container">
          {summaryData.map((item, key) => renderCard(item, key))}
        </div>
      )}
    </>
  );
};

export default TodaySalesSummary;
