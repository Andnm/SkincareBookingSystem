import React, { useState } from "react";
import { Input, Button, Collapse, Checkbox, Drawer, Radio } from "antd";
import { BiSearch } from "react-icons/bi";
import { CiFilter } from "react-icons/ci";

const { Panel } = Collapse;

const SearchFilterHeader = ({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filters,
  handleClearFilters,
  haveFilter,
}) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  return (
    <div
      className="search-filter-header"
      style={{ padding: "16px", display: "flex", flexDirection: "column" }}
    >
      <div className="flex justify-between">
        <div className="flex flex-row gap-4 items-center">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ marginRight: "8px", flex: 1, width: "500px" }}
            prefix={<BiSearch />}
          />
        </div>
        {haveFilter ? (
          <Button
            onClick={showDrawer}
            style={{ marginLeft: "8px" }}
            className="flex items-center gap-2"
          >
            <CiFilter className="w-5 h-5" />
            Bộ lọc
          </Button>
        ) : (
          <></>
        )}
      </div>

      <Drawer
        title="Filter"
        placement="right"
        closable={true}
        onClose={closeDrawer}
        open={isDrawerVisible}
        width={500}
      >
        <Collapse>
          {filters?.map((filter, index) => (
            <Panel header={filter.label} key={index.toString()}>
              {filter.options.map((option, indexValue) => (
                <Radio
                  key={`${index}-${indexValue}`}
                  checked={filter.value === option.value}
                  onChange={() => filter.onChange(option.value)}
                >
                  {option.label}
                </Radio>
              ))}
            </Panel>
          ))}
        </Collapse>

        <Button onClick={handleClearFilters} type="default" className="mt-8">
          Clear
        </Button>
      </Drawer>
    </div>
  );
};

export default SearchFilterHeader;
