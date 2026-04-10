"use client";
import React from "react";
import { FileTextOutlined,  } from "@ant-design/icons";
import { Button, Form, Input, Row, Col, Radio } from "antd";
import styles from "../orthoptic.module.css"

const OrthopticAssessment = () => {
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);

  // Layout settings
  const labelCol = { span: 3 };
  const choiceCol = { span: 5 }; // Span thoda barhaya taake alignment ki space mile
  const inputCol = { span: 16 };

  const rowStyle = {
    minHeight: "40px",
    display: "flex",
    alignItems: "center",
    padding: "4px 0",
  };

  // Common style for radio buttons to keep them aligned with headers
  const radioOptionStyle = { width: "100px" }; 

  return (
    <section className="p-6 bg-white shadow-sm rounded-lg">
      <Form form={form} layout="horizontal" size="small">
        <div className="mb-6 flex justify-start">
          <h1 className="text-xl font-bold uppercase text-sky-900 flex">
            <FileTextOutlined className="mr-2" /> Patient History
          </h1>
        </div>

        <div className="flex flex-col">
          {/* 1. Hx of deviation - Headers ki tarah kaam karega */}
          <Row style={rowStyle}>
            <Col {...labelCol} className="text-sm font-bold text-slate-800">Hx of deviation</Col>
            <Col span={19}>
              <Form.Item name="deviation" noStyle>
                <Radio.Group size="small" className="flex">
                  <Radio value="Left Eye" style={radioOptionStyle}>Left Eye</Radio>
                  <Radio value="Right Eye" style={radioOptionStyle}>Right Eye</Radio>
                  <Radio value="Both Eyes" style={radioOptionStyle}>Both Eyes</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {/* 2. Hx of Glasses */}
          <Row style={rowStyle}>
            <Col {...labelCol} className="text-sm font-bold text-slate-800">Hx of Glasses</Col>
            <Col {...choiceCol}>
              <Form.Item name="glasses_status" noStyle>
                <Radio.Group size="small" className="flex">
                  <Radio value="no" style={radioOptionStyle}>No</Radio>
                  <Radio value="yes" style={radioOptionStyle}>Yes</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col {...inputCol}>
              <div className="flex gap-2 w-full">
                <Form.Item name="gright" noStyle className="">
                  <Input placeholder="Right Eye" className="h-7 " disabled={formValues?.glasses_status !== "yes"} />
                </Form.Item>
                <Form.Item name="gleft" noStyle>
                  <Input placeholder="Left Eye" className="h-7 " disabled={formValues?.glasses_status !== "yes"} />
                </Form.Item>
              </div>
            </Col>
          </Row>

          {/* 3. Hx of Patching */}
          <Row style={rowStyle}>
            <Col {...labelCol} className="text-sm font-bold text-slate-800">Hx of Patching</Col>
            <Col {...choiceCol}>
              <Form.Item name="patching_status" noStyle>
                <Radio.Group size="small" className="flex">
                  <Radio value="no" style={radioOptionStyle}>No</Radio>
                  <Radio value="yes" style={radioOptionStyle}>Yes</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col {...inputCol}>
              <div className="flex gap-2 w-full">
                <Form.Item name="pright" noStyle>
                  <Input placeholder="Right Eye" className="h-7 flex-1" disabled={formValues?.patching_status !== "yes"} />
                </Form.Item>
                <Form.Item name="pleft" noStyle>
                  <Input placeholder="Left Eye" className="h-7 flex-1" disabled={formValues?.patching_status !== "yes"} />
                </Form.Item>
              </div>
            </Col>
          </Row>

          {/* 4. Hx of Trauma */}
          <Row style={rowStyle}>
            <Col {...labelCol} className="text-sm font-bold text-slate-800">Hx of Trauma</Col>
            <Col {...choiceCol}>
              <Form.Item name="trauma_status" noStyle>
                <Radio.Group size="small" className="flex">
                  <Radio value="no" style={radioOptionStyle}>No</Radio>
                  <Radio value="yes" style={radioOptionStyle}>Yes</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col {...inputCol}>
              <Form.Item name="trauma_detail" noStyle>
                <Input placeholder="Specify Trauma..." className="h-7 w-full" disabled={formValues?.trauma_status !== "yes"} />
              </Form.Item>
            </Col>
          </Row>

          {/* 5. Hx of Surgery */}
          <Row style={rowStyle}>
            <Col {...labelCol} className="text-sm font-bold text-slate-800">Hx of Surgery</Col>
            <Col {...choiceCol}>
              <Form.Item name="surgery_status" noStyle>
                <Radio.Group size="small" className="flex">
                  <Radio value="no" style={radioOptionStyle}>No</Radio>
                  <Radio value="yes" style={radioOptionStyle}>Yes</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col {...inputCol}>
              <Form.Item name="surgery_detail" noStyle className={styles.input}>
                <Input placeholder="Specify Surgery..." className="h-7 w-full" disabled={formValues?.surgery_status !== "yes"} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="primary" htmlType="submit" className={styles.saveButton}>
            Save
          </Button>
        </div>
      </Form>
    </section>
  );
};

export default OrthopticAssessment;