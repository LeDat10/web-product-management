import { useEffect, useState } from "react";
import { getDashboard } from "../../services/dashboardService";
import { Card, Col, Row, Tag } from "antd";
import "./Dashboard.scss";
import { getInfoAccount } from "../../services/accountServices";
import moment from "moment";
function Dashboard() {
    const [statistic, setStatistic] = useState({});
    const [infoAccount, setInfoAccount] = useState({});
    const fetchAPI = async () => {
        const result = await getDashboard();
        if (result.code === 200) {
            setStatistic(result.statistic);
        };
    };

    const fetchAPIInfo = async () => {
        const result = await getInfoAccount();
        if (result.code === 200) {
            setInfoAccount(result.account);
        };
    };

    useEffect(() => {
        fetchAPI();
        fetchAPIInfo();
    }, []);

    const renderStatus = (status) => {
        const colorMap = {
            active: 'success',
            inactive: 'error',
        };

        const labelMap = {
            active: 'Hoạt động',
            inactive: 'Dừng hoạt động',
        };
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
    };

    return (
        <>
            <div className="dashboard">
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Card
                            title={<b>Thông tin tài khoản</b>}
                        >
                            <Row gutter={50} align={"middle"}>
                                <Col span={6}>
                                    <img src={infoAccount?.avatar} style={{
                                        width: "150px",
                                        height: "150px",
                                        objectFit: 'cover'
                                    }} />
                                </Col>

                                <Col span={18}>
                                    <Row align={"middle"}>
                                        <Col span={12}>
                                            <div className="margin-bottom">
                                                <span className="dashboard__label">Họ tên: </span>
                                                <span className="dashboard__content">{infoAccount?.fullName}</span>
                                            </div>

                                            <div className="margin-bottom">
                                                <span className="dashboard__label">Email: </span>
                                                <span className="dashboard__content">{infoAccount?.email}</span>
                                            </div>

                                            <div className="margin-bottom">
                                                <span className="dashboard__label">Số điện thoại: </span>
                                                <span className="dashboard__content">{infoAccount?.phone}</span>
                                            </div>
                                        </Col>

                                        <Col span={12}>
                                            <div className="margin-bottom">
                                                <span className="dashboard__label">Trạng thái: </span>
                                                <span className="dashboard__content">{renderStatus(infoAccount?.status)}</span>
                                            </div>

                                            <div className="margin-bottom">
                                                <span className="dashboard__label">Nhóm quyền: </span>
                                                <span className="dashboard__content">{infoAccount?.roleTitle}</span>
                                            </div>

                                            <div className="margin-bottom">
                                                <span className="dashboard__label">Ngày tạo: </span>
                                                <span className="dashboard__content">{moment(infoAccount?.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    
                    <Col span={12}>
                        <Card
                            title={<b>Sản phẩm</b>}
                            style={{
                                height: "100%"
                            }}
                        >
                            <div className="margin-bottom">
                                <span className="dashboard__label">Số lượng: </span>
                                <span className="dashboard__content">{statistic.product?.total} sản phẩm</span>
                            </div>

                            <div className="margin-bottom">
                                <span className="dashboard__label">Sản phẩm nổi bật: </span>
                                <span className="dashboard__content">{statistic.product?.featured} sản phẩm</span>
                            </div>

                            <div className="margin-bottom">
                                <span className="dashboard__label">Hoạt động: </span>
                                <span className="dashboard__content">{statistic.product?.active} sản phẩm</span>
                            </div>

                            <div className="margin-bottom">
                                <span className="dashboard__label">Dừng hoạt động: </span>
                                <span className="dashboard__content">{statistic.product?.inactive} sản phẩm</span>
                            </div>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card
                            title={<b>Danh mục</b>}
                            style={{
                                height: "100%"
                            }}
                        >
                            <div className="margin-bottom">
                                <span className="dashboard__label">Số lượng: </span>
                                <span className="dashboard__content">{statistic.categoryProduct?.total} danh mục</span>
                            </div>

                            <div className="margin-bottom">
                                <span className="dashboard__label">Hoạt động: </span>
                                <span className="dashboard__content">{statistic.categoryProduct?.active} danh mục</span>
                            </div>

                            <div className="margin-bottom">
                                <span className="dashboard__label">Dừng hoạt động: </span>
                                <span className="dashboard__content">{statistic.categoryProduct?.inactive} danh mục</span>
                            </div>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card
                            title={<b>Tài khoản</b>}
                            style={{
                                height: "100%"
                            }}
                        >
                            <div className="margin-bottom">
                                <span className="dashboard__label">Số lượng: </span>
                                <span className="dashboard__content">{statistic.account?.total} tài khoản</span>
                            </div>

                            <div className="margin-bottom">
                                <span className="dashboard__label">Hoạt động: </span>
                                <span className="dashboard__content">{statistic.account?.active} tài khoản</span>
                            </div>

                            <div className="margin-bottom">
                                <span className="dashboard__label">Dừng hoạt động: </span>
                                <span className="dashboard__content">{statistic.account?.inactive} tài khoản</span>
                            </div>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card
                            title={<b>Người dùng</b>}
                            style={{
                                height: "100%"
                            }}
                        >
                            <div className="margin-bottom">
                                <span className="dashboard__label">Số lượng: </span>
                                <span className="dashboard__content">{statistic.user?.total} người dùng</span>
                            </div>

                            <div className="margin-bottom">
                                <span className="dashboard__label">Hoạt động: </span>
                                <span className="dashboard__content">{statistic.user?.active} người dùng</span>
                            </div>

                            <div className="margin-bottom">
                                <span className="dashboard__label">Dừng hoạt động: </span>
                                <span className="dashboard__content">{statistic.user?.inactive} người dùng</span>
                            </div>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Card
                            title={<b>Đơn hàng</b>}
                            style={{
                                height: "100%"
                            }}
                        >
                            <Row gutter={26}>
                                <Col span={8}>
                                    <div className="margin-bottom">
                                        <span className="dashboard__label">Số lượng: </span>
                                        <span className="dashboard__content">{statistic.order?.total} đơn hàng</span>
                                    </div>

                                    <div className="margin-bottom">
                                        <span className="dashboard__label">Đã thanh toán: </span>
                                        <span className="dashboard__content">{statistic.order?.payment} đơn hàng</span>
                                    </div>

                                    <div className="margin-bottom">
                                        <span className="dashboard__label">Chưa thanh toán: </span>
                                        <span className="dashboard__content">{statistic.order?.noPayment} đơn hàng</span>
                                    </div>
                                </Col>

                                <Col span={8}>
                                    <div className="margin-bottom">
                                        <span className="dashboard__label">Đang xử lý: </span>
                                        <span className="dashboard__content">{statistic.order?.pending} đơn hàng</span>
                                    </div>

                                    <div className="margin-bottom">
                                        <span className="dashboard__label">Đã xác nhận: </span>
                                        <span className="dashboard__content">{statistic.order?.confirmed} đơn hàng</span>
                                    </div>
                                    {/* pending", "confirmed", "shipping", "delivered", "cancelled", "refunded */}
                                    <div className="margin-bottom">
                                        <span className="dashboard__label">Đã gửi hàng: </span>
                                        <span className="dashboard__content">{statistic.order?.shipping} đơn hàng</span>
                                    </div>
                                </Col>

                                <Col span={8}>
                                    <div className="margin-bottom">
                                        <span className="dashboard__label">Đang giao: </span>
                                        <span className="dashboard__content">{statistic.order?.delivered} đơn hàng</span>
                                    </div>

                                    <div className="margin-bottom">
                                        <span className="dashboard__label">Đã hủy: </span>
                                        <span className="dashboard__content">{statistic.order?.cancelled} đơn hàng</span>
                                    </div>

                                    <div className="margin-bottom">
                                        <span className="dashboard__label">Đã hoàn tiền: </span>
                                        <span className="dashboard__content">{statistic.order?.refunded} đơn hàng</span>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Dashboard;