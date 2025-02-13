// components/TopServices.js
const TopServices = () => {
  const data = [
    { name: "Online Course", popularity: 45, color: "#1299fa" },
    { name: "Offline course", popularity: 29, color: "#26dfa0" },
    // { name: "Gọi điện tư vấn", popularity: 18, color: "#8554e6" },
    // { name: "Đặt lịch tư vấn", popularity: 25, color: "#fe8f0e" },
  ];

  return (
    <>
      <div className="summary_header">
        <p>Top services</p>
      </div>
      <table>
        <thead>
          <tr>
            <th className="summary_table_header">#</th>
            <th className="summary_table_header">Name</th>
            <th className="summary_table_header">Popularity</th>
            <th className="summary_table_header">Order</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
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
