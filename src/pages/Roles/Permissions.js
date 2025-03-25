import { Button, Drawer, message, Tree } from "antd";
import { SettingFilled } from "@ant-design/icons";
import './Roles.scss';
import { setPermissions } from "../../services/rolesServices";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { reload } from "../../actions/reload";
import useAuth from "../../helper/useAuth";

function Permissions(props) {
    const { record } = props;
    const [open, setOpen] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const dispatch = useDispatch();

    const permissions = useAuth();

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
                }
            ],
        },
        ,
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
                }
            ],
        },
    ]

    const handleOnCheck = (checkedKeysValue) => {
        setCheckedKeys(checkedKeysValue);
    };

    const handleClick = async () => {
        const filteredKeys = checkedKeys.filter(
            (key) => !treeData.some((node) => node.key === key)
        );
        const result = await setPermissions({
            id: record._id,
            permissions: filteredKeys
        });

        if (result.code === 200) {
            message.success("Cập nhật phân quyền thành công!");
            dispatch(reload());
        } else {
            message.error("Cập nhật phân quyền thất bại!");
        }
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
                            <Button type="primary" onClick={handleClick}>
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