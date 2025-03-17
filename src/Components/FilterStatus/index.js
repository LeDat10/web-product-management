import { Select } from 'antd';
import './FilterStatus.scss';

function FilterStatus(props) {
    const { filterStatusOptions, handleChangeStatus } = props;

    return (
        <>
            <div className='filter-status'>
                <Select
                    className='filter-status__select'
                    options={filterStatusOptions}
                    defaultValue={""}
                    onChange={handleChangeStatus}
                />
            </div>
        </>
    );
};

export default FilterStatus;