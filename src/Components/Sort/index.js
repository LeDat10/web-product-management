import { Select } from "antd";
import "./Sort.scss";

function Sort(props) {
    const {sortOptions, handleSort, defaultValue} = props;
    return (
        <>
            <div className='sort'>
                <Select
                    className="sort__select"
                    options={sortOptions}
                    defaultValue={defaultValue}
                    onChange={handleSort}
                />
            </div>
        </>
    );
};

export default Sort;