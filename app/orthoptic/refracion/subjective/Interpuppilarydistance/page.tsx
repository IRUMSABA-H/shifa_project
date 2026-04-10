"use client";

import { useEffect } from "react";
import { Button, Col, Form, Input, Radio, Row } from "antd";
import Link from "next/link";
import styles from "./interpupilary.module.css";
import { useSubjectiveSummary } from "../subjective-context";

type InterpupillaryFormValues = {
  interpuppilaryDistance?: "no" | "yes";
  near?: string;
  distance?: string;
  remarks?: string;
};

const InterpuppilaryDistance = () => {
  const [form] = Form.useForm<InterpupillaryFormValues>();
  const { updateSummaryRow } = useSubjectiveSummary();
  const isEnabled = Form.useWatch("interpuppilaryDistance", form);

  const withLabel = (label: string, value?: string) =>
    value?.trim() ? `${label}: ${value.trim()}` : "";

  useEffect(() => {
    if (isEnabled !== "yes") {
      form.setFieldsValue({
        near: undefined,
        distance: undefined,
        remarks: undefined,
      });
    }
  }, [form, isEnabled]);

  const handleFinish = (values: InterpupillaryFormValues) => {
    if (values.interpuppilaryDistance !== "yes") {
      updateSummaryRow("interpupillary-distance", {
        rightEye: {
          spherical: "No",
          cylindrical: "",
          axis: "",
          visualAcuity: "",
          action: "",
        },
        leftEye: {
          spherical: "",
          cylindrical: "",
          axis: "",
          visualAcuity: "",
          action: "",
        },
      });
      return;
    }

    updateSummaryRow("interpupillary-distance", {
      rightEye: {
        spherical: withLabel("Near", values.near),
        cylindrical: withLabel("Distance", values.distance),
        axis: withLabel("Remarks", values.remarks),
        visualAcuity: "",
        action: "",
      },
      leftEye: {
        spherical:"",
        cylindrical: "",
        axis: "",
        visualAcuity: "",
        action: "",
      },
    });
  };

  return (
    <section className="gap-4">
      <Form form={form} layout="horizontal" onFinish={handleFinish}>
        <div className="flex flex-col gap-3">
          <Row gutter={24}>
            <Col span={5}>
              <span className="font-bold">Interpuppilary Distance(ID)</span>
            </Col>
            <Col span={16}>
              <Form.Item noStyle name="interpuppilaryDistance">
                <Radio.Group size="small">
                  <Radio value="no">No</Radio>
                  <Radio value="yes">Yes</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col span={5}>
              <span className="font-bold">Near</span>
            </Col>
            <Col span={16}>
              <Form.Item noStyle name="near">
                <Input placeholder="Near" disabled={isEnabled !== "yes"} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={5}>
              <span className="font-bold">Distance</span>
            </Col>
            <Col span={16}>
              <Form.Item noStyle name="distance">
                <Input placeholder="Distance" disabled={isEnabled !== "yes"} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24} align="middle">
            <Col span={5}>
              <span className="font-bold">Remarks</span>
            </Col>
            <Col span={16}>
              <Form.Item noStyle name="remarks">
                <Input placeholder="Remarks" disabled={isEnabled !== "yes"} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={5} />
            <Col span={16}>
              <div className="flex justify-end gap-2">
                <Link href="/orthoptic/refracion/subjective/Nearvision">
                  <Button className={styles.backButton}>Back</Button>
                </Link>
                <Button htmlType="submit" className={styles.saveButton}>
                  Save
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </Form>
    </section>
  );
};

export default InterpuppilaryDistance;
