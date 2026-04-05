"use client";
import { Form, Row, Col, Button, Input, Select, Radio } from "antd";
import { MdDelete } from "react-icons/md";
import { TimePicker } from 'antd';
import styles from "./refraction.module.css";

const ReFraction = () => {
  const [form] = Form.useForm();
const format = 'HH:mm';
const formValues=Form.useWatch([],form)
const getEyeValue = (eyePrefix:string) => {
    const reflex = formValues?.[`${eyePrefix}_eye_reflex`];
    const otherValue = formValues?.[`${eyePrefix}_others_value`]; // Added name to your input
    const placement = formValues?.[`${eyePrefix}_placement`];

    let displayText = "";
    if (reflex === "others") {
      displayText = otherValue || "";
    } else if (reflex) {
      displayText = reflex;
    }

    return { displayText, placement };
  };

  const rightEye = getEyeValue("right");
  const leftEye = getEyeValue("left");
  

  return (
    <>
      <Form
        form={form}
        size="small"
        layout="horizontal"
        initialValues={{ "dilation-drops": [{}] }}
      >
        {/* dilation stamp row hai */}
        <Row gutter={16}>
          <Col span={3}>
            <span className="font-bold text-sky-900">Dilation Stamp</span>
          </Col>

          <Col span={16}>
            {/* Dilation Stamp Section */}
            <div>
              <Form.List name="dilation-drops">
                {(fields, { add, remove }) => (
                  <>
                    {/* Blue Header Row */}
                    <Row
                      className="refraction-header-row bg-sky-700 text-white p-1 font-bold "
                      align="middle"
                    >
                      <Col span={6}>Dilating Drops</Col>
                      <Col span={4}>Eye</Col>
                      <Col span={4} className="ml-40">
                        Time Instillation
                      </Col>
                      <Col span={3} className="ml-2">
                        No. of Drops
                      </Col>
                      <Col span={1}>
                        <Button
                          type="primary"
                          className={styles.addButton}
                          size="small"
                          onClick={() => add()}
                          style={{ color: "white", borderColor: "white" }}
                        >
                          ADD
                        </Button>
                      </Col>
                    </Row>
                    {fields.map(({ key, name }) => (
                      <Row
                        key={key}
                        gutter={12}
                        className={styles.refractionDataRow}
                        align="middle"
                      >
                        <Col span={6}>
                          <Form.Item
                            className={styles.refractionItem}
                            name={[name, "drop"]}
                          >
                            <Select
                              style={{ width: 190 }}
                              options={[
                                {
                                  label: "Ofloxacin",
                                  value: "Ofloxacin",
                                }, {
                                  label: "Tobramycin",
                                  value: "Tobramycin",
                                },{
                                  label: "Moxifloxacin",
                                  value: "Moxifloxacin",
                                },{
                                  label: "Ciprofloxacin",
                                  value: "Ciprofloxacin",
                                },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8.5}>
                          <Form.Item
                            className={styles.refractionItem}
                            name={[name, "eye"]}
                          >
                            <Radio.Group className={styles.refractionRadioGroup}>
                              <Radio value="both" className="text-xs">
                                Both Eyes
                              </Radio>
                              <Radio value="right" className="text-xs">
                                Right Eye
                              </Radio>
                              <Radio value="left" className="text-xs">
                                Left Eye
                              </Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            className={`${styles.refractionItem} ${styles.inputSpacing}`}
                            name={[name, "time"]}
                          >
                            <TimePicker format={format} />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            className={styles.refractionItem}
                            name={[name, "dropsCount"]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={1}>
                          <Form.Item
                            className={styles.refractionItem}
                            name={[name, "delete"]}
                          >
                            <MdDelete
                              className={styles.icon}
                              onClick={() => remove(name)}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}
                  </>
                )}
              </Form.List>
            </div>
          </Col>
        </Row>
        {/* workin distance row hai ya */}
        <Row gutter={16} className="mt-3">
          <Col span={3}>
            <span className="font-bold text-sky-900">Working Distance</span>
          </Col>
          <Col span={16}>
            <Form.Item name="working distance">
              <Input placeholder="working distance" style={{ height: 25 }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Main Container Row */}
        <Row gutter={16} align="top" className="mb-4">
          {/* COLUMN 1: LABELS (Retino & Retino Result) */}
          <Col span={3}>
            <div className="flex flex-col justify-between h-full min-h-[110px]">
              <span className="font-bold text-sky-900 block mt-1">Retino</span>
              <span className="font-bold text-sky-900 block mt-12">
                Retino Result
              </span>
            </div>
          </Col>

          {/* COLUMN 2: INPUTS (Eyes Rows + Result Input) */}
          <Col span={16}>
            <div className="flex flex-col gap-3">
              {/* Right Eye Row */}
              <Row gutter={8} align="middle">
                <Col span={3}>
                  <span className="font-bold text-xs">Right Eye</span>
                </Col>
                <Col span={9}>
                  <Form.Item noStyle name="right_eye_reflex">
                    <Radio.Group className="flex gap-1">
                      <Radio value="no reflex" className="text-[10px] ">
                        No Reflex
                      </Radio>
                      <Radio value="dullreflex" className="text-[10px]">
                        Dull Reflex
                      </Radio>
                      <Radio value="others" className="text-[10px]">
                        Others
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={5}>
                <Form.Item noStyle name="right_others_value">
                  <Input placeholder="Others Value" size="small" disabled={formValues?.right_eye_reflex !== 'others'} />
                  </Form.Item>
                </Col>
                <Col span={3} className="text-right font-bold text-[10px]">
                  Placement:
                </Col>
                <Col span={4}>
                <Form.Item noStyle name="right_placement">
                  <Select
                    size="small"
                    className="w-full"
                    placeholder="Select"
                    options={[
                    
                         {value:'R1', label:'R1'},
                         {value:'R2', label:'R2'},
                         {value:'R3', label:'R3'},
                         {value:'R4', label:'R4'},
                      
                    ]}
                  />
                  </Form.Item>
                </Col>
              </Row>

              {/* Left Eye Row */}
              <Row gutter={8} align="middle">
                <Col span={3}>
                  <span className="font-bold text-xs">Left Eye</span>
                </Col>
                <Col span={9}>
                  <Form.Item noStyle name="left_eye_reflex">
                    <Radio.Group className="flex gap-1">
                      <Radio value="no reflex" className="text-[10px]">
                        No Reflex
                      </Radio>
                      <Radio value="dullreflex" className="text-[10px]">
                        Dull Reflex
                      </Radio>
                      <Radio value="others" className="text-[10px]">
                        Others
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={5}>
                <Form.Item noStyle name="left_others_value">
                  <Input placeholder="Others Value" size="small" disabled={formValues?.left_eye_reflex !== 'others'} />
                  </Form.Item>
                </Col>
                <Col span={3} className="text-right font-bold text-[10px]">
                  Placement:
                </Col>
                <Col span={4}>
                <Form.Item noStyle name="left_placement">
                  <Select
                    size="small"
                    className="w-full"
                    placeholder="Select"
                    options={[
                      {value:'L1', label:'L1'},
                      {value:'L2', label:'L2'},
                      {value:'L3', label:'L3'},
                      {value:'L4', label:'L4'},
                    ]}
                  />
                  </Form.Item>
                </Col>
                
                
              </Row>

              {/* Retino Result Input Field (Exactly in line with its label) */}
              <Row className="mt-1">
                <Col span={24}>
                  <Form.Item noStyle name="retino_result">
                    <Input
                      placeholder="Retino Result"
                      style={{ height: 28 }}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>

          {/* COLUMN 3: DIAGRAMS (Side by Side) */}
          <Col span={5}>
            <div className="flex justify-around items-center  pl-4 h-full">
              <div className="text-center">
                <p className="font-bold text-[10px] mb-1">Right Eye</p>
                <div className="relative w-20 h-20 border-black">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black"></div>
                  <div className="absolute left-1/2 top-0 w-[1px] h-full bg-black"></div>
                  {['R1', 'R2', 'R3', 'R4'].map((pos) => (
                     <div key={pos} className={`absolute text-[9px] w-1/2 h-1/2 flex items-center justify-center p-1 overflow-hidden break-words
                        ${pos==='R1'?'top-0 left-0': pos==='R2'?'top-0 left-1/2': pos==='R3'?'top-1/2 left-0': 'top-1/2 left-1/2'}`}>
                        <span className={rightEye.placement === pos ? "text-blue-600 font-bold" : "text-gray-300"}>
                          {rightEye.placement === pos ? rightEye.displayText : pos}
                        </span>
                     </div>
                  ))}
                </div>
              </div>
              <div className="text-center ml-2">
                <p className="font-bold text-[10px] mb-1">Left Eye</p>
                <div className="relative w-20 h-20 border-black">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black"></div>
                  <div className="absolute left-1/2 top-0 w-[1px] h-full bg-black"></div>
                 {['L1', 'L2', 'L3', 'L4'].map((pos) => (
                     <div key={pos} className={`absolute text-[9px] w-1/2 h-1/2 flex items-center justify-center p-1 overflow-hidden break-words
                        ${pos==='L1'?'top-0 left-0': pos==='L2'?'top-0 left-1/2': pos==='L3'?'top-1/2 left-0': 'top-1/2 left-1/2'}`}>
                        <span className={leftEye.placement === pos ? "text-blue-600 font-bold" : "text-gray-300"}>
                          {leftEye.placement === pos ? leftEye.displayText : pos}
                        </span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <div className="gap-4 flex flex-row justify-center items-end">
          <div>
          <Button className={styles.saveButton}>Save</Button>
          </div>
          <div>
          <Button className={styles.nextButton}>Next</Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ReFraction;
