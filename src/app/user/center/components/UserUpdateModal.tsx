import {ProColumns, ProTable} from '@ant-design/pro-components';
import {message, Modal} from 'antd';
import React from 'react';
import {updateUserUsingPost} from "@/api/userController";


//来看看这个要怎么写才会比较合理。。？

interface Props {
    oldData?: API.User;
    visible: boolean;
    columns: ProColumns<API.User>[];
    onSubmit: (values: API.UserUpdateRequest) => void;
    onCancel: () => void;
}

/**
 * 更新方法
 *
 * @param fields
 */
const handleUpdate = async (fields: API.UserUpdateRequest) => {
    // const hide = message.loading('正在更新你的个人信息');
    try {
        await updateUserUsingPost(fields);
        // hide();
        message.success('个人信息更新成功');
        return true;
    } catch (error: any) {
        // hide();
        message.error('个人信息更新失败，' + error.message);
        return false;
    }
};

/**
 * 更新弹窗
 * @param props
 * @constructor
 */
const UserUpdateModal: React.FC<Props> = (props) => {
    const {oldData, visible, columns, onSubmit, onCancel} = props;

    if (!oldData) {
        return <></>;
    }

    return (
        <Modal
            destroyOnClose
            title={'更新你的个人信息'}
            open={visible}
            footer={null}
            onCancel={() => {
                onCancel?.();
            }}
        >
            <ProTable
                type="form"
                columns={columns}
                form={{
                    initialValues: oldData,
                }}
                onSubmit={async (values: API.UserUpdateRequest) => {
                    const success = await handleUpdate({
                        ...values,
                        id: oldData.id as any,
                    });
                    if (success) {
                        onSubmit?.(values);
                    }
                }}
            />
        </Modal>
    );
};
export default UserUpdateModal;
