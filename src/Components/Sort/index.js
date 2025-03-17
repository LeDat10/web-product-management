import { Select } from "antd";
import "./Sort.scss";

function Sort(props) {
    const {sortOptions, handleSort} = props;
    return (
        <>
            <div className='sort'>
                <Select
                    className="sort__select"
                    options={sortOptions}
                    defaultValue={"position-desc"}
                    onChange={handleSort}
                />
            </div>
        </>
    );
};

export default Sort;