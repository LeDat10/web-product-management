import { Input } from "antd";

const { Search } = Input;

function InputSearch(props) {
    const { onSearch } = props;
    return (
        <>
            <div className='search'>
                <Search
                    placeholder="Tìm kiếm..."
                    allowClear
                    enterButton
                    onSearch={onSearch}
                />
            </div>
        </>
    );
};

export default InputSearch;