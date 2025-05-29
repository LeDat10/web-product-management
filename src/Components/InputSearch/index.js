import { Input } from "antd";

const { Search } = Input;

function InputSearch(props) {
    const { placeholder, onSearch, defaultValue } = props;
    return (
        <>
            <div className='search'>
                <Search
                    placeholder={placeholder || "Tìm kiếm..."}
                    allowClear
                    enterButton
                    onSearch={onSearch}
                    defaultValue={defaultValue}
                />
            </div>
        </>
    );
};

export default InputSearch;