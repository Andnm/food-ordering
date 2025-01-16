import { TopServicesType } from "@models/statistic";

// components/TopServices.js
interface Props {
  topServices: TopServicesType[];
}

const TopServices: React.FC<Props> = (props) => {
  const { topServices } = props;

  return (
    <>
      <div className="summary_header">
        <p>Top dịch vụ</p>
      </div>
      <table>
        <thead>
          <tr>
            <th className="summary_table_header">#</th>
            <th className="summary_table_header">Tên</th>
            <th className="summary_table_header">Độ phổ biến</th>
            <th className="summary_table_header">Đơn hàng</th>
          </tr>
        </thead>
        <tbody>
          {topServices.map((item, index) => (
            <tr key={index}>
              <td className="summary_table_text">{index + 1}</td>
              <td className="summary_table_text">{item.name}</td>
              <td>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${item.popularity}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </td>
              <td>
                {" "}
                <div
                  className="summary_table_value"
                  style={{
                    borderColor: item.color,
                    // backgroundColor: item.color,
                    color: item.color,
                    backgroundColor: `rgba(${parseInt(
                      item.color.slice(1, 3),
                      16
                    )}, ${parseInt(item.color.slice(3, 5), 16)}, ${parseInt(
                      item.color.slice(5, 7),
                      16
                    )}, 0.1)`,
                  }}
                >
                  {item.popularity}%
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TopServices;
