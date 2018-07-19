import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Icon,
  List,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Ellipsis from '../../components/Ellipsis';
import styles from '../List/CardList.less';

import { host } from '../../config'

const FormItem = Form.Item;
const Option = Select.Option

@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
  confirmLoading: loading.effects['product/addProduct']
}))
@Form.create()
export default class CardList extends PureComponent {

  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    fileData: "",
    fileType: "",
    fileList: []
  };

  componentDidMount() {

    this.props.dispatch({
      type: 'product/getCategoryList',
    });

    this.props.dispatch({
      type: "product/listProduct"
    });

  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAdd = (fieldsValue) => {
    // console.log(fieldsValue)
    this.props.dispatch({
      type: 'product/addProduct',
      payload: {
        category_id: fieldsValue.category_id,
        name: fieldsValue.name,
        desc: fieldsValue.desc,
        fileData: this.state.fileData,
        fileType: this.state.fileType
      }
    });
    message.success("添加成功")
  }

  okHandle = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.handleAdd(fieldsValue);
    });
  }

  render() {
    const { product, loading, form } = this.props;
    // console.log(product)
    const { modalVisible } = this.state;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          段落示意：蚂蚁金服务设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，
          提供跨越设计与开发的体验解决方案。
        </p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" /> 快速开始
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" /> 产品简介
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" /> 产品文档
          </a>
        </div>
      </div>
    );

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img alt="这是一个标题" src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png" />
      </div>
    );

    const uploadProps = {
      listType: "picture",
      className: 'upload-list-inline',
      // action: '//jsonplaceholder.typicode.com/posts/',
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
            fileData: ""
          };
        });
      },
      beforeUpload: (file) => {
        if (this.state.fileList.length == 0) {
          this.setState(({ fileList }) => ({
            fileList: [...fileList, file],
          }));

          var reader = new FileReader();
          reader.readAsDataURL(file)
          reader.onload = () => {
            // console.log(reader.result)
            this.setState({
              fileData: reader.result,
            })
          }
          reader.onerror = (error) => {
            // console.log("Error:", error)
          }

          let fileType = file.type.split("/")[1]
          if (fileType == "png") {
            this.setState({
              fileType: fileType
            })
          } else if (fileType == "jpeg") {
            this.setState({
              fileType: "jpg"
            })
          }
        }
        return false;
      },
      fileList: this.state.fileList,
    }

    const dataSource = product.products ? product.products : []

    return (
      <PageHeaderLayout
        title="产品列表"
      >
        <div className={styles.cardList}>
          <div style={{ textAlign: 'center'}}>
            <Button type="dashed" className={styles.newButton} onClick={() => {
              this.handleModalVisible(true)
            }}>
              <Icon type="plus" /> 新增产品
            </Button>
          </div>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[...dataSource]}
            renderItem={item => (
              <List.Item key={item.ID}>
                <Card hoverable className={styles.card} actions={[
                  <a style={{ color: "#1089ff" }} onClick={() => { }}><IconText type="edit" text={"修改"} /></a>,
                  <a style={{ color: "red" }} onClick={() => { }}><IconText type="delete" text={"删除"} /></a>
                ]}>
                  <Card.Meta
                    title={<a href="#">{item.Name}</a>}
                    description={(
                      <Ellipsis className={styles.item} lines={3}>{item.Description}</Ellipsis>
                    )}
                  />
                  <img src={host + "/" + item.Image.FileName} alt="" style={{ width: "100%", height: "100%" }} />
                </Card>
              </List.Item>
            )}
          />
        </div>

        {/* 创建modal */}
        <Modal
          title="新建产品"
          visible={this.state.modalVisible}
          onOk={() => {
            this.okHandle()
            this.handleModalVisible(this.props.confirmLoading)
          }}
          onCancel={() => this.handleModalVisible()}
          confirmLoading={this.props.confirmLoading}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="产品分类"
          >
            {form.getFieldDecorator('category_id', {
              rules: [{ required: true, message: '请输入产品名' }],
            })(
              // <Input placeholder="分类" />
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="选择一个分类"
                optionFilterProp="children"
                // onChange={handleChange}
                // onFocus={handleFocus}
                // onBlur={handleBlur}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  product.categories.map(function (item, index) {
                    return (<Option key={index} value={item.ID}>{item.Name}</Option>)
                  })
                }
              </Select>,
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="产品名字"
          >
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入产品名' }],
            })(
              <Input placeholder="请输入产品名字" />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="产品描述"
          >
            {form.getFieldDecorator('desc', {
              rules: [{ required: true, message: '请输入描述' }],
            })(
              <Input.TextArea placeholder="请输入产品描述" autosize={{ minRows: 5 }} />
            )}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="产品图片"
          >
            {form.getFieldDecorator('image', {
              rules: [{ required: true, message: '请输入选择图片' }],
            })(
              <Upload {...uploadProps} type="picture">
                <Button><Icon type="upload" />上传</Button>
              </Upload>
            )}
          </FormItem>

        </Modal>
      </PageHeaderLayout>
    );
  }
}
