import { Button, Drawer, message, Tree } from "antd";
import { SettingFilled } from "@ant-design/icons";
import './Roles.scss';
import { setPermissions } from "../../services/rolesServices";
import { useState } from "react";
import { useSelector } from "react-redux";

function Permissions(props) {
    const { record } = props;
    const [open, setOpen] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const treeData = [
        {
            title: <b>Sản phẩm</b>,
            key: "products",
            children: [
                {
                    title: 'Xem',
                    key: 'products_view',
                },
                {
                    title: 'Thêm mới',
                    key: 'products_create',
                },
                {
                    title: 'Chỉnh sửa',
                    key: 'products_edit',
                },
                {
                    title: 'Xóa',
                    key: 'products_delete',
                },
                {
                    title: "Thùng rác",
                    key: "products_trash"
                },
                {
                    title: "Khôi phục",
                    key: "products_restore"
                },
                {
                    title: "Xóa vĩnh viễn",
                    key: "products_delete-permanently"
                }
            ],
        },
        {
            title: <b>Danh mục sản phẩm</b>,
            key: "products-category",
            children: [
                {
                    title: 'Xem',
                    key: 'products-category_view',
                },
                {
                    title: 'Thêm mới',
                    key: 'products-category_create',
                },
                {
                    title: 'Chỉnh sửa',
                    key: 'products-category_edit',
                },
                {
                    title: 'Xóa',
                    key: 'products-category_delete',
                },
                {
                    title: "Thùng rác",
                    key: "products-category_trash"
                },
                {
                    title: "Khôi phục",
                    key: "products-category_restore"
                },
                {
                    title: "Xóa vĩnh viễn",
                    key: "products-category_delete-permanently"
                }
            ],
        },
        {
            title: <b>Nhóm quyền</b>,
            key: "roles",
            children: [
                {
                    title: 'Xem',
                    key: 'roles_view',
                },
                {
                    title: 'Thêm mới',
                    key: 'roles_create',
                },
                {
                    title: 'Chỉnh sửa',
                    key: 'roles_edit',
                },
                {
                    title: 'Xóa',
                    key: 'roles_delete',
                },
                {
                    title: 'Phân quyền',
                    key: 'roles_permissions',
                },
                {
                    title: "Thùng rác",
                    key: "roles_trash"
                },
                {
                    title: "Khôi phục",
                    key: "roles_restore"
                },
                {
                    title: "Xóa vĩnh viễn",
                    key: "roles_delete-permanently"
                }
            ],
        },
        {
            title: <b>Tài khoản</b>,
            key: "accounts",
            children: [
                {
                    title: 'Xem',
                    key: 'accounts_view',
                },
                {
                    title: 'Thêm mới',
                    key: 'accounts_create',
                },
                {
                    title: 'Chỉnh sửa',
                    key: 'accounts_edit',
                },
                {
                    title: 'Xóa',
                    key: 'accounts_delete',
                },
                {
                    title: "Thùng rác",
                    key: "accounts_trash"
                },
                {
                    title: "Khôi phục",
                    key: "accounts_restore"
                },
                {
                    title: "Xóa vĩnh viễn",
                    key: "accounts_delete-permanently"
                }
            ],
        },
        {
            title: <b>Đơn hàng</b>,
            key: "order",
            children: [
                {
                    title: 'Xem',
                    key: 'order_view',
                },
                {
                    title: 'Chỉnh sửa',
                    key: 'order_edit',
                },
                {
                    title: 'Xóa',
                    key: 'order_delete',
                },
                {
                    title: "Thùng rác",
                    key: "order_trash"
                },
                {
                    title: "Khôi phục",
                    key: "order_restore"
                },
                {
                    title: "Xóa vĩnh viễn",
                    key: "order_delete-permanently"
                }
            ],
        },
        {
            title: <b>Người dùng</b>,
            key: "user",
            children: [
                {
                    title: 'Xem',
                    key: 'user_view',
                },
                {
                    title: 'Chỉnh sửa',
                    key: 'user_edit',
                },
                {
                    title: 'Xóa',
                    key: 'user_delete',
                },
                {
                    title: "Thùng rác",
                    key: "user_trash"
                },
                {
                    title: "Khôi phục",
                    key: "user_restore"
                },
                {
                    title: "Xóa vĩnh viễn",
                    key: "user_delete-permanently"
                }
            ],
        },
    ]

    const handleOnCheck = (checkedKeysValue) => {
        setCheckedKeys(checkedKeysValue);
    };

    const handleClick = async () => {
        setLoading(true);
        const filteredKeys = checkedKeys.filter(
            (key) => !treeData.some((node) => node.key === key)
        );
        const result = await setPermissions({
            id: record._id,
            permissions: filteredKeys
        });

        if (result.code === 200) {
            message.success(result.message);
        } else {
            message.error(result.message);
        };
        setLoading(false);
    };

    return (
        <>
            {permissions.includes("roles_permissions") && (
                <div className="roles__permissions">
                    <Button icon={<SettingFilled />} color="purple" variant="outlined" onClick={showDrawer}>
                        Phân quyền
                    </Button>

                    <Drawer
                        title={<b>{record.title}</b>}
                        onClose={onClose}
                        open={open}
                        extra={
                            <Button loading={loading} type="primary" onClick={handleClick}>
                                Cập nhật
                            </Button>
                        }
                    >
                        <Tree
                            treeData={treeData}
                            checkable
                            onCheck={handleOnCheck}
                            defaultCheckedKeys={record.permissions}
                            defaultExpandedKeys={treeData.map(node => node.key)}
                            autoExpandParent={true}
                        />
                    </Drawer>
                </div>
            )}
        </>
    );
};

export default Permissions;