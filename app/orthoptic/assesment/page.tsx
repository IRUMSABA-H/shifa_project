"use client";
import { useState } from "react";
import { FileTextOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Row, Col } from "antd";
import styles from "../orthoptic.module.css";

const OrthopticAssessment = () => {
  const [form] = Form.useForm();
  const [deviation, setDeviation] = useState<string>();
  const [glasses, setGlasses] = useState<string>("");
  const [patching, setPatching] = useState<string>("");
  const [traumaStatus, setTraumaStatus] = useState<string>("");
  const [surgeryStatus, setSurgeryStatus] = useState<string>("");

  const handleChoice = (name: string, value: "yes" | "no") => {
    form.setFieldValue(name, value);
    if (name === "glasses") setGlasses(value);
    if (name === "patching") setPatching(value);
    if (name === "traumaStatus") setTraumaStatus(value);
    if (name === "surgeryStatus") setSurgeryStatus(value);
  };

  // Grid Configuration for perfect alignment
  const labelCol = { span: 4 }; // Hx of ...
  const choiceCol = { span: 4}; // No / Yes
  const inputCol = { span: 16 }; // Input Fields

  const rowStyle = {
    
    minHeight: "40px",
    display: "flex",
    alignItems: "center",
    padding: "2px 0",
  };

  return (
    <section className="p-6 bg-white shadow-sm rounded-lg">
      <Form form={form}
      layout="horizontal"
      size="small"
      className={styles.formScope}
       >
        <div className="mb-6 flex items-center justify-center">
          <h1 className="text-xl font-bold uppercase text-sky-900 flex items-center">
            <FileTextOutlined className="mr-2" /> Patient History
          </h1>
        
        </div>

        <div className="flex flex-col">
          {/* 1. Hx of deviation */}
          <Row style={rowStyle}>
            <Col {...labelCol} className="text-sm font-bold text-slate-800">
              Hx of deviation
            </Col>
            <Col span={16}>
              <div className="flex gap-4">
                {["Left Eye", "Right Eye", "Both Eyes"].map((label) => (
                  <label
                    key={label}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <Checkbox
                      checked={deviation === label}
                      onChange={() => {
                        setDeviation(label);
                        form.setFieldValue("deviation", label);
                      }}
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </Col>
          </Row>

          {/* 2. Hx of Glasses */}
          <Row style={rowStyle}>
            <Col {...labelCol} className="text-sm font-bold text-slate-800">
              Hx of Glasses
            </Col>
            <Col {...choiceCol}>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={glasses === "no"}
                    onChange={() => handleChoice("glasses", "no")}
                  />
                  <span className="text-sm">No</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                  className={styles.checkboxSpacing}
                    checked={glasses === "yes"}
                    onChange={() => handleChoice("glasses", "yes")}
                  />
                  <span className="text-sm">Yes</span>
                </label>
              </div>
            </Col>
            <Col {...inputCol}>
              {glasses === "yes" && (
                <div className="flex  gap-2 w-full">
                  <Form.Item name="gright" noStyle>
                    <Input
                      placeholder="Right Eye"
                      size="small"
                      className="h-7 flex-1 "
                    />
                  </Form.Item>
                  <Form.Item name="gleft" noStyle>
                    <Input
                      placeholder="Left Eye"
                      size="small"
                      className="h-7 flex-1"
                    />
                  </Form.Item>
                </div>
              )}
            </Col>
          </Row>

          {/* 3. Hx of Patching */}
          <Row style={rowStyle}>
            <Col {...labelCol} className="text-sm font-bold text-slate-800">
              Hx of Patching
            </Col>
            <Col {...choiceCol}>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={patching === "no"}
                    onChange={() => handleChoice("patching", "no")}
                  />
                  <span className="text-sm">No</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                   className={styles.checkboxSpacing}
                    checked={patching === "yes"}
                    onChange={() => handleChoice("patching", "yes")}
                  />
                  <span className="text-sm">Yes</span>
                </label>
              </div>
            </Col>
            <Col {...inputCol}>
              {patching === "yes" && (
                <div className="flex gap-2 w-full">
                  <Form.Item name="pright" noStyle>
                    <Input
                      placeholder="Right"
                      size="small"
                      className="h-7 flex-1"
                    />
                  </Form.Item>
                  <Form.Item name="pleft" noStyle>
                    <Input
                      placeholder="Left"
                      size="small"
                      className="h-7 flex-1"
                    />
                  </Form.Item>
                </div>
              )}
            </Col>
          </Row>

          {/* 4. Hx of Trauma */}
          <Row style={rowStyle}>
            <Col {...labelCol} className="text-sm font-bold text-slate-800">
              Hx of Trauma
            </Col>
            <Col {...choiceCol}>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={traumaStatus === "no"}
                    onChange={() => handleChoice("traumaStatus", "no")}
                  />
                  <span className="text-sm">No</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                   className={styles.checkboxSpacing}
                    checked={traumaStatus === "yes"}
                    onChange={() => handleChoice("traumaStatus", "yes")}
                  />
                  <span className="text-sm">Yes</span>
                </label>
              </div>
            </Col>
            <Col {...inputCol}>
              {traumaStatus === "yes" && (
                <Form.Item name="trauma" noStyle>
                  <Input
                    placeholder="Specify Trauma..."
                    size="small"
                    className="h-7 w-full"
                  />
                </Form.Item>
              )}
            </Col>
          </Row>

          {/* 5. Hx of Surgery */}
          <Row style={rowStyle}>
            <Col {...labelCol} className="text-sm font-bold text-slate-800">
              Hx of Surgery
            </Col>
            <Col {...choiceCol}>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={surgeryStatus === "no"}
                    onChange={() => handleChoice("surgeryStatus", "no")}
                  />
                  <span className="text-sm">No</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                   className={styles.checkboxSpacing}
                    checked={surgeryStatus === "yes"}
                    onChange={() => handleChoice("surgeryStatus", "yes")}
                  />
                  <span className="text-sm">Yes</span>
                </label>
              </div>
            </Col>
            <Col {...inputCol}>
              {surgeryStatus === "yes" && (
                <Form.Item name="surgery" noStyle>
                  <Input
                
                    placeholder="Specify Surgery..."
                    size="small"
                    className={`h-7 w-full ${styles.inputSpacing}`}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
        </div>
        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            className={styles.saveButton}
          >
            Save
          </Button>
          </div>
      </Form>
    </section>
  );
};

export default OrthopticAssessment;
