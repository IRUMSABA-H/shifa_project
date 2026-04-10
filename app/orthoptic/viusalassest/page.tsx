"use client";
import { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Table,
  message,
  Col,
  type TableColumnsType,
} from "antd";
import { TableOutlined } from "@ant-design/icons";
import styles from "../orthoptic.module.css";
import { FaCheckCircle } from "react-icons/fa";

type EyeSide = "Right Eye" | "Left Eye";
type Category = "With Glasses" | "Without Glasses" | "With Pin Hole";
type AssessmentMode = "system" | "manual";
type SystemType = "british" | "american";
type ManualType = "hand" | "light" | "nolight";

type AssessmentRow = {
  key: string;
  category: Category;
  eye: EyeSide;
  criteria: string;
  british: string;
  american: string;
  value1: string;
  value2: string;
  hand: string;
  light: string;
  nolight: string;
  datetime: string;
};

type AssessmentFormValues = {
  selectType?: Category;
  eyeSide?: EyeSide;
  mode?: AssessmentMode;
  systemType?: SystemType;
  numerator?: string;
  denominator?: string;
  manualType?: ManualType;
  chartNotes?: string;
};

const VisualAssest = () => {
  const [form] = Form.useForm<AssessmentFormValues>();
  const [isVisualAcuityYes, setIsVisualAcuityYes] = useState<boolean | null>(
    null,
  );
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [tableDataByChart, setTableDataByChart] = useState<
    Record<string, AssessmentRow[]>
  >({});
  const currentChartData = selectedChart
    ? tableDataByChart[selectedChart] || []
    : [];
  const columns: TableColumnsType<AssessmentRow> = [
    {
      title: "",
      dataIndex: "category",
      key: "category",
      onCell: (_record, index) => ({
        rowSpan: index !== undefined && index % 2 === 0 ? 2 : 0,
      }),
      render: (text: string) => <strong>{text}</strong>,
    },
    { title: "", dataIndex: "eye", key: "eye" },
    { title: "Criteria", dataIndex: "criteria", key: "criteria" },
    {
      title: "British System",
      dataIndex: "british",
      key: "british",
      align: "center",
      render: (value: string) =>
        value === "selected" && (
          <div className="flex justify-center  items-center w-full">
            <FaCheckCircle style={{ color: "green" }} />
          </div>
        ),
    },
    {
      title: "American System",
      dataIndex: "american",
      key: "american",
      align: "center",
      render: (value: string) =>
        value === "selected" && (
          <div className="flex justify-center  items-center w-full">
            <FaCheckCircle style={{ color: "green" }} />
          </div>
        ),
    },
    { title: "Numerator", dataIndex: "value1", key: "value1" },
    { title: "Denominator", dataIndex: "value2", key: "value2" },
    {
      title: "Hand Movement",
      dataIndex: "hand",
      key: "hand",
      render: (value: string) =>
        value === "Yes" && (
          <div className="flex justify-center  items-center w-full">
            <FaCheckCircle style={{ color: "green" }} />
          </div>
        ),
    },
    {
      title: "Perception of Light",
      dataIndex: "light",
      key: "light",
      render: (value: string) =>
        value === "Yes" && (
          <div className="flex justify-center  items-center w-full">
            <FaCheckCircle style={{ color: "green" }} />
          </div>
        ),
    },
    {
      title: "No Perception of Light",
      dataIndex: "nolight",
      key: "nolight",
      align: "center",
      render: (value: string) =>
        value === "Yes" && (
          <div className="flex justify-center 0 items-center w-full">
            <FaCheckCircle style={{ color: "green" }} />
          </div>
        ),
    },
    { title: "Date & Time", dataIndex: "datetime", key: "datetime" },
  ];
  const resetAssessmentFields = () => {
    form.setFieldsValue({
      eyeSide: undefined,
      mode: undefined,
      systemType: undefined,
      numerator: undefined,
      denominator: undefined,
      manualType: undefined,
    });
  };

  const onFinish = (values: AssessmentFormValues) => {
    if (!selectedChart) {
      message.error("Please select a chart first");
      return;
    }

    if (!values.selectType || !values.eyeSide) {
      message.error("Please complete the required assessment fields");
      return;
    }

    if (!values.mode) {
      message.error("Please select system based or manual criteria");
      return;
    }

    const newEntry: AssessmentRow = {
      key: Date.now().toString(),
      category: values.selectType,
      criteria:
        values.mode === "system"
          ? "system based"
          : values.mode === "manual"
            ? "manual"
            : "",
      eye: values.eyeSide,
      british: values.systemType === "british" ? "selected" : "",
      american: values.systemType === "american" ? "selected" : "",
      value1: values.numerator || "",
      value2: values.denominator || "",
      hand: values.manualType === "hand" ? "Yes" : "",
      light: values.manualType === "light" ? "Yes" : "",
      nolight: values.manualType === "nolight" ? "Yes" : "",
      datetime: new Date().toLocaleString(),
    };
    form.resetFields([
      "eyeSide",
      "mode",
      "systemType",
      "numerator",
      "denominator",
      "manualType",
    ]);
    message.success("Entry added to table");
    setTableDataByChart((prev) => ({
      ...prev,
      [selectedChart]: [...(prev[selectedChart] || []), newEntry],
    }));
  };
  return (
    <div className="pt-2">
      <div className="mb-2 flex items-center gap-4 rounded-lg p-4">
        <p className="text-sm font-bold uppercase text-black underline">
          Visual Acuity Assessment
        </p>
        <div className="flex gap-6">
          <Checkbox
            checked={isVisualAcuityYes === true}
            onChange={(e) =>
              setIsVisualAcuityYes(e.target.checked ? true : null)
            }
          >
            <span className="text-xs">Yes</span>
          </Checkbox>
          <Checkbox
            checked={isVisualAcuityYes === false}
            onChange={(e) =>
              setIsVisualAcuityYes(e.target.checked ? false : null)
            }
          >
            <span className="text-xs">No</span>
          </Checkbox>
        </div>
      </div>

      {isVisualAcuityYes && (
        <div className="flex flex-col">
          <div className="p-4">
            <p className="mb-2 text-sm tracking-wider text-gray-500">
              Types of Charts
            </p>
            <Select
              placeholder="Select a chart to record or view data"
              className="w-full lg:w-full"
              onChange={(value) => setSelectedChart(value)}
              value={selectedChart}
              options={[
                {
                  value: "OPTOKINETIC NYSTAGMUS",
                  label: "OPTOKINETIC NYSTAGMUS",
                },
                { value: "LEA gratings", label: "LEA gratings" },
                { value: "LEA symbols", label: "LEA symbols" },
                { value: "Picture Chart", label: "Picture Chart" },
                { value: "E-Chart", label: "E-Chart" },
                { value: "Snellen Chart", label: "Snellen Chart" },
              ]}
            />
          </div>

          <div className="p-5">
            {!selectedChart ? (
              <div className="flex h-full flex-col items-center justify-center py-20 text-gray-300">
                <TableOutlined style={{ fontSize: "60px" }} />
                <p className="mt-5 text-lg font-medium italic">
                  Select a chart to record or view data
                </p>
              </div>
            ) : (
              <Form
                form={form}
                onFinish={onFinish}
                size="small"
                className={styles.formScope}
                layout="horizontal"
              >
                <div className="va-container animate-in fade-in duration-500">
                  <h2 className="text-sm font-bold uppercase text-sky-700 mb-1">
                    Assessment: {selectedChart}
                  </h2>

                  <Form.Item
                    name="mode"
                    rules={[{ required: true, message: "" }]}
                    hidden
                  ></Form.Item>

                  {["OPTOKINETIC NYSTAGMUS", "LEA gratings"].includes(
                    selectedChart,
                  ) ? (
                    <div className="flex w-full flex-col gap-5">
                      <div className="w-full">
                        <Form.Item
                          name="chartNotes"
                          className={`${styles.notesItem} mb-0 w-full`}
                          style={{ width: "100%" }}
                        >
                          <textarea
                            placeholder="Enter notes..."
                            rows={4}
                            className="block min-w-full w-full! rounded-lg border border-gray-300 p-4 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <Button type="primary" className={styles.primaryButton}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="  flex flex-col gap-6">
                      {/* First Row - Type Selection */}
                      <Row gutter={21} align="middle">
                        <Col span={3}>
                          <span className={`font-bold ${styles.required}`}>
                            Select Type
                          </span>
                        </Col>
                        <Col span={3}>
                          <Form.Item
                            className="mb-0"
                            name="selectType"
                            rules={[{ required: true, message: "" }]}
                          >
                            <Select
                              style={{ width: 150 }}
                              placeholder="select . . ."
                              options={[
                                {
                                  label: "With Glasses",
                                  value: "With Glasses",
                                },
                                {
                                  label: "Without Glasses",
                                  value: "Without Glasses",
                                },
                                {
                                  label: "With Pin Hole",
                                  value: "With Pin Hole",
                                },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            className="mb-0 "
                            name="eyeSide"
                            rules={[{ required: true, message: "" }]}
                          >
                            <Radio.Group className="flex ">
                              <Radio
                                value="Right Eye"
                                className={styles.righteye}
                              >
                                Right Eye
                              </Radio>
                              <Radio
                                value="Left Eye"
                                className={styles.lefteye}
                                
                              >
                                Left Eye
                              </Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                      </Row>

                      {/* Second Row - System Based */}
                      <Row gutter={21} align="middle">
                        <Col span={3}>
                          <Form.Item
                            noStyle
                            shouldUpdate={(prev, curr) =>
                              prev.mode !== curr.mode
                            }
                          >
                            {({ getFieldValue, setFieldsValue }) => (
                              <Radio
                                checked={getFieldValue("mode") === "system"}
                                onChange={() =>
                                  setFieldsValue({
                                    mode: "system",
                                    manualType: undefined,
                                  })
                                }
                              >
                                System Based
                              </Radio>
                            )}
                          </Form.Item>
                        </Col>

                        <Form.Item
                          noStyle
                          // Yahan humne bataya ke jab 'mode' ya 'system_Type' dono mein se kuch bhi badle to update karo
                          shouldUpdate={(prev, curr) =>
                            prev.mode !== curr.mode ||
                            prev.systemType !== curr.systemType
                          }
                        >
                          {({ getFieldValue, setFieldsValue }) => {
                            const isSystem = getFieldValue("mode") === "system";
                            const systemType = getFieldValue("systemType");

                            const denominatorOptions =
                              systemType === "british"
                                ? Array.from({ length: 10 }, (_, i) => ({
                                    value: `${i + 1}`,
                                    label: `${i + 1}`,
                                  }))
                                : systemType === "american"
                                  ? Array.from({ length: 10 }, (_, i) => ({
                                      value: `${i + 11}`,
                                      label: `${i + 11}`,
                                    }))
                                  : [];

                            return (
                              <>
                                <Col span={8}>
                                  <Form.Item
                                    name="systemType"
                                    className="mb-0"
                                    rules={[
                                      { required: isSystem, message: "" },
                                    ]}
                                  >
                                    <Radio.Group
                                      className="flex  "
                                      disabled={!isSystem}
                                      value={getFieldValue("systemType")}
                                      onChange={(e) => {
                                        const nextSystemType = e.target
                                          .value as SystemType | undefined;
                                        setFieldsValue({
                                          systemType: nextSystemType,
                                          numerator:
                                            nextSystemType === "american"
                                              ? "20"
                                              : nextSystemType === "british"
                                                ? "6"
                                                : undefined,
                                          denominator: undefined,
                                        });
                                      }}
                                    >
                                      <Radio
                                        value="british"
                                        name="british"
                                        
                                      >
                                        British System (meters)
                                      </Radio>
                                      <Radio
                                        value="american"
                                       className={styles.american}
                                      >
                                        American System (feet)
                                      </Radio>
                                    </Radio.Group>
                                  </Form.Item>
                                </Col>

                                <Col span={3} className="mr-4">
                                  <div className="flex items-center gap-1">
                                    <span
                                      className={styles.numerator}
                                    >
                                      Numerator
                                    </span>
                                    <Form.Item
                                   
                                      name="numerator"
                                      rules={[
                                        { required: isSystem, message: "" },
                                      ]}
                                    >
                                      <Input
                                       className={styles.numerator}
                                        style={{ width: 75 }}
                                        disabled={!isSystem || !systemType}
                                        readOnly
                                      />
                                    </Form.Item>
                                  </div>
                                </Col>

                                <Col span={6}>
                                  <div className="flex items-center gap-1 ">
                                    <span
                                      className={styles.denumerator}
                                    >
                                      /Denominator
                                    </span>
                                    <Form.Item
                                      name="denominator"
                                      rules={[
                                        { required: isSystem, message: "" },
                                      ]}
                                    >
                                      <Select
                                      className={styles.denumerator}
                                        style={{ width: 75 }}
                                        disabled={!isSystem || !systemType}
                                        options={denominatorOptions}
                                      />
                                    </Form.Item>
                                  </div>
                                </Col>
                              </>
                            );
                          }}
                        </Form.Item>
                      </Row>

                      {/* Third Row - Manual */}
                      <Row gutter={24} align="middle">
                        <Col span={3}>
                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) =>
                              prevValues.mode !== currentValues.mode
                            }
                          >
                            {({ getFieldValue, setFieldsValue }) => (
                              <Radio
                                className={styles.required}
                                checked={getFieldValue("mode") === "manual"}
                                onChange={() =>
                                  setFieldsValue({
                                    mode: "manual",
                                    systemType: undefined,
                                    numerator: undefined,
                                    denominator: undefined,
                                  })
                                }
                              >
                                Manual
                              </Radio>
                            )}
                          </Form.Item>
                        </Col>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) =>
                            prevValues.mode !== currentValues.mode
                          }
                        >
                          {({ getFieldValue }) => {
                            const ismanual = getFieldValue("mode") === "manual";
                            return (
                              <>
                                <Col span={12}>
                                  <Form.Item
                                    className="mb-0"
                                    name="manualType"
                                    rules={[
                                      { required: ismanual, message: "" },
                                    ]}
                                  >
                                    <Radio.Group disabled={!ismanual}>
                                      <Radio value="hand" name="systemType">
                                        Hand Movement
                                      </Radio>
                                      <Radio
                                        value="light"
                                        className={styles.radioOffsetLight}
                                      >
                                        Perception of Light
                                      </Radio>
                                      <Radio
                                        value="nolight"
                                        className={styles.radioOffsetNoLight}
                                      >
                                        No Perception of Light
                                      </Radio>
                                    </Radio.Group>
                                  </Form.Item>
                                </Col>
                                {/* Add Button aligned to the right like in image */}
                                <Col span={3}>
                                  <Form.Item>
                                    <Button
                                      type="primary"
                                      className={styles.primaryButton}
                                      htmlType="submit"
                                    >
                                      save
                                    </Button>
                                  </Form.Item>
                                </Col>
                              </>
                            );
                          }}
                        </Form.Item>
                      </Row>
                    </div>
                  )}
                </div>
                {currentChartData.length > 0 && (
                  <div className="mt-10">
                    <Table
                      dataSource={currentChartData}
                      columns={columns}
                      pagination={false}
                      bordered
                      size="small"
                      className={styles.visualTable}
                    />
                    
                  </div>
                )}
              </Form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualAssest;
