"use client";

import { useEffect } from "react";
import { Col, Form, Row, Radio, Select, Input, Button } from "antd";
import styles from "./nearvision.module.css";
import Link from "next/link";
import { useSubjectiveSummary } from "../subjective-context";

type NearvisionFormvalues = {
  nearvision?: string;
  righteye?: string;
  rightspherical?: string | number;
  rightsphericalwhole?: string;
  rightshericalchart?: string;
  lefteye?: string;
  leftspherical?: string | number;
  leftsphericalwhole?: string;
  leftshericalchart?: string;
};

const decimalOptions = [
  { label: "00", value: "00" },
  { label: "25", value: "25" },
  { label: "50", value: "50" },
  { label: "75", value: "75" },
];

const chartOptions = [
  { value: "N18", label: "N18" },
  { value: "N12", label: "N12" },
  { value: "N10", label: "N10" },
  { value: "N8", label: "N8" },
];

const NearVision = () => {
  const [form] = Form.useForm<NearvisionFormvalues>();
  const { updateSummaryRow } = useSubjectiveSummary();
  const nearvision = Form.useWatch("nearvision", form);
  const rightEye = Form.useWatch("righteye", form);
  const leftEye = Form.useWatch("lefteye", form);
  const rightSphericalValue = Form.useWatch("rightspherical", form);
  const leftSphericalValue = Form.useWatch("leftspherical", form);

  useEffect(() => {
    if (nearvision !== "yes") {
      form.setFieldsValue({
        righteye: undefined,
        rightspherical: undefined,
        rightsphericalwhole: undefined,
        rightshericalchart: undefined,
        lefteye: undefined,
        leftspherical: undefined,
        leftsphericalwhole: undefined,
        leftshericalchart: undefined,
      });
    }
  }, [form, nearvision]);

  useEffect(() => {
    if (rightEye !== "yes") {
      form.setFieldsValue({
        rightspherical: undefined,
        rightsphericalwhole: undefined,
        rightshericalchart: undefined,
      });
    }
  }, [form, rightEye]);

  useEffect(() => {
    if (leftEye !== "yes") {
      form.setFieldsValue({
        leftspherical: undefined,
        leftsphericalwhole: undefined,
        leftshericalchart: undefined,
      });
    }
  }, [form, leftEye]);

  const setPositiveField = (
    field: "rightspherical" | "leftspherical",
    value: number | "",
  ) => {
    if (value === "") {
      form.setFieldsValue({ [field]: "" });
      return;
    }

    form.setFieldsValue({
      [field]: Math.abs(value),
    });
  };

  const stepValue = (field: "rightspherical" | "leftspherical") => {
    const current = form.getFieldValue(field);
    const currentNumber =
      current === undefined || current === null || current === ""
        ? 0
        : Number(current);

    form.setFieldsValue({
      [field]: currentNumber + 1,
    });
  };

  const buildEyeSummary = (
    eyeEnabled: string | undefined,
    sphericalWhole: string | number | undefined,
    sphericalChart: string | undefined,
    chart: string | undefined,
    sideLabel: "Right Eye" | "Left Eye",
  ) => {
    if (eyeEnabled !== "yes") {
      return {
        spherical: "No",
        cylindrical: "",
        axis: "",
        visualAcuity: "",
        action: "",
      };
    }

    const signedWhole =
      sphericalWhole === undefined || sphericalWhole === null || sphericalWhole === ""
        ? ""
        : `+${Math.abs(Number(sphericalWhole))}`;

    const summaryText = [
      signedWhole ? `Add ${signedWhole}${sphericalChart ? `.${sphericalChart}` : ""}` : "",
      sideLabel,
      chart ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return {
      spherical: summaryText,
      cylindrical: "",
      axis: "",
      visualAcuity: chart ?? "",
      action: "",
    };
  };

  const handleFinish = (values: NearvisionFormvalues) => {
    updateSummaryRow("near-vision", {
      rightEye: buildEyeSummary(
        values.righteye,
        values.rightspherical,
        values.rightsphericalwhole,
        values.rightshericalchart,
        "Right Eye",
      ),
      leftEye: buildEyeSummary(
        values.lefteye,
        values.leftspherical,
        values.leftsphericalwhole,
        values.leftshericalchart,
        "Left Eye",
      ),
    });
  };

  return (
    <section className="gap-2">
      <Form form={form} onFinish={handleFinish}>
        <div className="flex flex-col gap-3">
          <Row gutter={24} align="middle">
            <Col span={4}>
              <span className="font-bold">Near Vision(NV)</span>
            </Col>
            <Col>
              <Form.Item noStyle name="nearvision">
                <Radio.Group name="nearvision" size="small">
                  <Radio value="no">No</Radio>
                  <Radio value="yes">yes</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24} align="middle">
            <Col span={4}>
              <span className="font-bold">Right Eye</span>
            </Col>
            <Col span={3}>
              <Form.Item noStyle name="righteye">
                <Radio.Group
                  name="righteye"
                  size="small"
                  disabled={nearvision !== "yes"}
                >
                  <Radio value="no">No</Radio>
                  <Radio value="yes">yes</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={6}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sky-700">Spherical</span>
                <div className={rightEye !== "yes" ? "pointer-events-none opacity-50" : ""}>
                  <Form.Item noStyle name="rightspherical">
                    <Input
                      size="small"
                      style={{ width: 90, height: 25 }}
                      disabled={rightEye !== "yes"}
                      className="text-center"
                      addonBefore={
                        <div
                          className="flex h-full w-full select-none items-center justify-center font-bold text-blue-600"
                          style={{
                            minWidth: "8px",
                            cursor: rightEye === "yes" ? "pointer" : "default",
                          }}
                          onClick={() =>
                            rightEye === "yes" && stepValue("rightspherical")
                          }
                        >
                          +
                        </div>
                      }
                      value={
                        rightSphericalValue === undefined ||
                        rightSphericalValue === ""
                          ? ""
                          : Math.abs(Number(rightSphericalValue))
                      }
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^0-9]/g, "");
                        if (!cleaned) {
                          return setPositiveField("rightspherical", "");
                        }
                        setPositiveField("rightspherical", Number(cleaned));
                      }}
                    />
                  </Form.Item>
                </div>
                <span className="font-bold text-xl">.</span>
                <Form.Item noStyle name="rightsphericalwhole">
                  <Select
                    size="small"
                    style={{ width: 75, height: 25 }}
                    disabled={rightEye !== "yes"}
                    options={decimalOptions}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={3}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sky-700">chart</span>
                <Form.Item noStyle name="rightshericalchart">
                  <Select
                    size="small"
                    style={{ width: 75, height: 25 }}
                    disabled={rightEye !== "yes"}
                    options={chartOptions}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row gutter={24} align="middle">
            <Col span={4}>
              <span className="font-bold">Left Eye</span>
            </Col>
            <Col span={3}>
              <Form.Item noStyle name="lefteye">
                <Radio.Group
                  name="lefteye"
                  size="small"
                  disabled={nearvision !== "yes"}
                >
                  <Radio value="no">No</Radio>
                  <Radio value="yes">yes</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={6}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sky-700">Spherical</span>
                <div className={leftEye !== "yes" ? "pointer-events-none opacity-50" : ""}>
                  <Form.Item noStyle name="leftspherical">
                    <Input
                      size="small"
                      style={{ width: 90, height: 25 }}
                      disabled={leftEye !== "yes"}
                      className="text-center"
                      addonBefore={
                        <div
                          className="flex h-full w-full select-none items-center justify-center font-bold text-blue-600"
                          style={{
                            minWidth: "8px",
                            cursor: leftEye === "yes" ? "pointer" : "default",
                          }}
                          onClick={() =>
                            leftEye === "yes" && stepValue("leftspherical")
                          }
                        >
                          +
                        </div>
                      }
                      value={
                        leftSphericalValue === undefined ||
                        leftSphericalValue === ""
                          ? ""
                          : Math.abs(Number(leftSphericalValue))
                      }
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^0-9]/g, "");
                        if (!cleaned) {
                          return setPositiveField("leftspherical", "");
                        }
                        setPositiveField("leftspherical", Number(cleaned));
                      }}
                    />
                  </Form.Item>
                </div>
                <span className="font-bold text-xl">.</span>
                <Form.Item noStyle name="leftsphericalwhole">
                  <Select
                    size="small"
                    style={{ width: 75, height: 25 }}
                    disabled={leftEye !== "yes"}
                    options={decimalOptions}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={3}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sky-700">chart</span>
                <Form.Item noStyle name="leftshericalchart">
                  <Select
                    size="small"
                    style={{ width: 75, height: 25 }}
                    disabled={leftEye !== "yes"}
                    options={chartOptions}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row gutter={24} align="middle">
            <Col span={3} />
            <Col span={5} />
            <Col span={8}>
              <div className="ml-10 flex justify-end gap-2">
                <Link href="/orthoptic/refracion/subjective/InterMediatevision">
                  <Button className={styles.backButton}>Back</Button>
                </Link>
                <Button htmlType="submit" className={styles.saveButton}>
                  Save
                </Button>
                <Link href="/orthoptic/refracion/subjective/Interpuppilarydistance">
                  <Button className={styles.nextButton}>Next</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </Form>
    </section>
  );
};

export default NearVision;
