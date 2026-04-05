"use client";

import { Button, Col, Form, Input, Row, Select } from "antd";
import styles from "../refraction.module.css";

export default function SubjectivePage() {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="horizontal" size="small">
      <Row gutter={16} className="mt-3">
        <Col span={3}>
          <span className="font-bold text-sky-900">Visual Acuity</span>
        </Col>
        <Col span={8}>
          <Form.Item name="right_visual_acuity">
            <Input placeholder="Right Eye" style={{ height: 25 }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="left_visual_acuity">
            <Input placeholder="Left Eye" style={{ height: 25 }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={3}>
          <span className="font-bold text-sky-900">Acceptance</span>
        </Col>
        <Col span={8}>
          <Form.Item name="right_acceptance">
            <Select
              placeholder="Right Eye Acceptance"
              options={[
                { label: "Accepted", value: "accepted" },
                { label: "Not Accepted", value: "not_accepted" },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="left_acceptance">
            <Select
              placeholder="Left Eye Acceptance"
              options={[
                { label: "Accepted", value: "accepted" },
                { label: "Not Accepted", value: "not_accepted" },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={3}>
          <span className="font-bold text-sky-900">Remarks</span>
        </Col>
        <Col span={16}>
          <Form.Item name="remarks">
            <Input placeholder="Remarks" style={{ height: 25 }} />
          </Form.Item>
        </Col>
      </Row>

      <div className="flex flex-row gap-3 justify-end">
        <Button className={styles.saveButton}>Save</Button>
        <Button className={styles.nextButton}>Next</Button>
      </div>
    </Form>
  );
}
