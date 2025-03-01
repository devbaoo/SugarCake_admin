import { Modal } from "antd";
const CustomModel = (props) => {
	const { open, hideModal, btnAction, title } = props;
	return (
		<>
			<Modal
				title='Sneaker Store'
				open={open}
				onOk={btnAction}
				onCancel={hideModal}
				okText='Ok'
				cancelText='Cancel'>
				<p>{title}</p>
			</Modal>
		</>
	);
};

export default CustomModel;
